// Data katalog aset
const products = [
  // ORNAMENT
  { name: "Wayang Arjuna & Shinta", cat: "Ornament", slug: "Wayang-Arjuna-Shinta" },
  { name: "Ornament-Awan", cat: "Ornament", slug: "Ornament-Awan" },
  { name: "2 EURO", cat: "Ornament", slug: "2-Euro" },
  { name: "Ondel - Ondel", cat: "Ornament", slug: "Ondel-Ondel" },
  { name: "Jembatan Ampera", cat: "Ornament", slug: "Jembatan-Ampera" },
  { name: "Ornament Rumah Bugis", cat: "Ornament", slug: "Ornament-Rumah-Bugis" },
  { name: "Ornament Rumah Batak", cat: "Ornament", slug: "Ornament-Batak" },
  { name: "Ornament Rumah Minang", cat: "Ornament", slug: "Ornament-Rumah-Minang" },
  { name: "Rumah Joglo", cat: "Ornament", slug: "Rumah-Joglo" },
  { name: "Ornament Rumah Joglo", cat: "Ornament", slug: "Ornament-Rumah-Joglo" },
  { name: "Ornament Rumah Joglo 2", cat: "Ornament", slug: "Ornament-Rumah-Joglo-2" },
  { name: "Ornament Rumah Joglo 3", cat: "Ornament", slug: "Ornament-Rumah-Joglo-3" },
  { name: "Ornament Singer Lampung", cat: "Ornament", slug: "Ornament-Singer-Lampung" },
  { name: "Mahkota-Sunda", cat: "Ornament", slug: "Mahkota-Sunda" },
  { name: "Bissmillah", cat: "Ornament", slug: "Bissmillah" },
  { name: "Buku Nikah", cat: "Ornament", slug: "Buku-Nikah" },
  { name: "Logam Mulia", cat: "Ornament", slug: "Logam-Mulia" },
  { name: "Meja Baca", cat: "Ornament", slug: "Meja-Baca" },
  { name: "Name Tag", cat: "Ornament", slug: "Name-Tag" },
  { name: "Tasbih", cat: "Ornament", slug: "Tasbih" },
  // SILUET
  { name: "Siluet People 01", cat: "siluet", slug: "Siluet-People-01" },
  { name: "Siluet People 02", cat: "siluet", slug: "Siluet-People-02" },
  { name: "Siluet People 03", cat: "siluet", slug: "Siluet-People-03" },
  { name: "Siluet People 04", cat: "siluet", slug: "Siluet-People-04" },
  // FRAME
  { name: "Masjid 01", cat: "frame", slug: "Frame-Masjid-01" },
  { name: "Frame Jawa", cat: "frame", slug: "Frame-Jawa" },
  { name: "Masjid 02", cat: "frame", slug: "Frame-Masjid-02" },
  { name: "Prince", cat: "frame", slug: "Frame-Prince" },
  // PROFESI
  { name: "Profesi Jalasenantri", cat: "profesi", slug: "Profesi-Jalasenantri" },
  { name: "Profesi Polri", cat: "profesi", slug: "Profesi-Polri" },
  { name: "Profesi TNI Darat", cat: "profesi", slug: "Profesi-TNI-Darat" },
  { name: "Profesi TNI Laut", cat: "profesi", slug: "Profesi-TNI-Laut" },
  { name: "Profesi TNI Udara", cat: "profesi", slug: "Profesi-TNI-Udara" },
  { name: "BHAYANGKARI-(KEMALA-HIKMAH)", cat: "profesi", slug: "BHAYANGKARI-(KEMALA-HIKMAH)" }
];

// State aplikasi
let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'default';
let viewMode = 'grid'; // 'grid' atau 'list'
let filteredList = [...products];
let activePreviewIndex = 0;

// Elemen DOM
const grid = document.getElementById('grid');
const menu = document.getElementById('menu');
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearchBtn');
const sortSelect = document.getElementById('sortSelect');
const itemCount = document.getElementById('itemCount');
const emptyState = document.getElementById('emptyState');
const previewModal = document.getElementById('previewModal');
const scrollTopBtn = document.getElementById('scrollTopBtn');

// Format huruf kapital di awal kata kategori
function formatBadge(cat) {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

// Render tombol filter kategori beserta jumlah itemnya
function renderCategoryMenu() {
  const categories = [
    { id: 'all', label: 'Semua' },
    { id: 'Ornament', label: 'Ornament' },
    { id: 'siluet', label: 'Siluet' },
    { id: 'frame', label: 'Frame' },
    { id: 'profesi', label: 'Profesi' }
  ];

  menu.innerHTML = categories.map(c => {
    const count = c.id === 'all' 
      ? products.length 
      : products.filter(p => p.cat.toLowerCase() === c.id.toLowerCase()).length;
    const isActive = currentFilter.toLowerCase() === c.id.toLowerCase();

    return `
      <button data-filter="${c.id}"
        class="filter-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border whitespace-nowrap transition cursor-pointer ${
          isActive 
            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-sm' 
            : 'border-slate-800 bg-slate-900/70 text-slate-300 hover:border-emerald-500/50 hover:text-white'
        }">
        <span>${c.label}</span>
        <span class="px-1.5 py-0.2 rounded-full text-[11px] ${isActive ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}">${count}</span>
      </button>
    `;
  }).join('');
}

// Render Kartu Produk (Mendukung tampilan Grid & List)
function renderCards() {
  // 1. Filter berdasarkan kategori & pencarian
  let result = products.filter(item => {
    const matchCat = currentFilter === 'all' || item.cat.toLowerCase() === currentFilter.toLowerCase();
    const keyword = currentSearch.toLowerCase().trim();
    const matchSearch = item.name.toLowerCase().includes(keyword) || 
                        item.cat.toLowerCase().includes(keyword) ||
                        item.slug.toLowerCase().includes(keyword);
    return matchCat && matchSearch;
  });

  // 2. Pengurutan
  if (currentSort === 'az') {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === 'za') {
    result.sort((a, b) => b.name.localeCompare(a.name));
  }

  filteredList = result;
  itemCount.textContent = result.length;

  if (result.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  if (viewMode === 'grid') {
    grid.className = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5';
    grid.innerHTML = result.map((item, idx) => {
      const imgSrc = `asset/img/${item.slug}.jpg`;
      const cdrHref = `asset/file/${item.slug}.cdr`;
      const fallbackImg = `https://placehold.co/400x400/0f172a/22c55e?text=${encodeURIComponent(item.name)}`;

      return `
        <article class="group bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 hover:border-emerald-500/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col">
          <!-- Area Gambar (Klik untuk Quick View) -->
          <div onclick="openPreviewModal(${idx})" title="Klik untuk memperbesar gambar"
            class="aspect-square bg-slate-950 relative overflow-hidden border-b border-slate-800/80 cursor-zoom-in">
            <span class="absolute top-2.5 left-2.5 z-10 bg-slate-950/85 backdrop-blur-md border border-slate-800 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-slate-300">
              ${formatBadge(item.cat)}
            </span>
            <!-- Ikon Zoom saat hover -->
            <div class="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
              <span class="p-2.5 rounded-full bg-slate-900/90 border border-slate-700 text-emerald-400 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
              </span>
            </div>
            <img src="${imgSrc}" alt="${item.name}" loading="lazy"
              onerror="this.onerror=null;this.src='${fallbackImg}';"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>

          <!-- Info & Tombol Download -->
          <div class="p-3.5 sm:p-4 flex-1 flex flex-col justify-between gap-3">
            <h3 onclick="openPreviewModal(${idx})" class="font-semibold text-sm sm:text-base text-slate-100 hover:text-emerald-400 leading-snug line-clamp-2 cursor-pointer transition" title="${item.name}">
              ${item.name}
            </h3>
            <div class="flex items-center gap-2">
              <button onclick="openPreviewModal(${idx})" title="Lihat Detail"
                class="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-600 text-slate-300 hover:text-white transition cursor-pointer">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </button>
              <a href="${cdrHref}" download
                class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-emerald-500/70 bg-slate-950 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-semibold text-xs sm:text-sm transition-all duration-200">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                <span>Download</span>
              </a>
            </div>
          </div>
        </article>
      `;
    }).join('');
  } else {
    // TAMPILAN LIST (RINGKAS & CEPAT DIPINDAI)
    grid.className = 'flex flex-col gap-3';
    grid.innerHTML = result.map((item, idx) => {
      const imgSrc = `asset/img/${item.slug}.jpg`;
      const cdrHref = `asset/file/${item.slug}.cdr`;
      const fallbackImg = `https://placehold.co/200x200/0f172a/22c55e?text=${encodeURIComponent(item.name)}`;

      return `
        <article class="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-emerald-500/50 rounded-2xl p-3 flex items-center justify-between gap-4 transition">
          <div class="flex items-center gap-3.5 min-w-0">
            <div onclick="openPreviewModal(${idx})" class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 cursor-zoom-in">
              <img src="${imgSrc}" alt="${item.name}" loading="lazy"
                onerror="this.onerror=null;this.src='${fallbackImg}';"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div class="min-w-0">
              <span class="inline-block text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mb-1">
                ${formatBadge(item.cat)}
              </span>
              <h3 onclick="openPreviewModal(${idx})" class="font-semibold text-sm sm:text-base text-slate-100 hover:text-emerald-400 truncate cursor-pointer">
                ${item.name}
              </h3>
              <p class="text-xs text-slate-500 font-mono truncate hidden sm:block">${item.slug}.cdr</p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <button onclick="openPreviewModal(${idx})" class="px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 hover:border-slate-600 text-slate-300 text-xs sm:text-sm font-medium transition cursor-pointer">
              Lihat
            </button>
            <a href="${cdrHref}" download
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-500/70 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 font-semibold text-xs sm:text-sm transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span class="hidden sm:inline">Download</span>
            </a>
          </div>
        </article>
      `;
    }).join('');
  }
}

// Event Filter Kategori
menu.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  currentFilter = btn.dataset.filter;
  renderCategoryMenu();
  renderCards();
});

// Event Pencarian Real-time
searchInput.addEventListener('input', (e) => {
  currentSearch = e.target.value;
  clearSearchBtn.classList.toggle('hidden', currentSearch.length === 0);
  renderCards();
});

function clearSearch() {
  searchInput.value = '';
  currentSearch = '';
  clearSearchBtn.classList.add('hidden');
  searchInput.focus();
  renderCards();
}

function resetAllFilters() {
  currentFilter = 'all';
  currentSearch = '';
  currentSort = 'default';
  searchInput.value = '';
  sortSelect.value = 'default';
  clearSearchBtn.classList.add('hidden');
  renderCategoryMenu();
  renderCards();
}

// Event Pengurutan
sortSelect.addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderCards();
});

// Ubah Mode Tampilan (Grid / List)
function setViewMode(mode) {
  viewMode = mode;
  const gridBtn = document.getElementById('viewGridBtn');
  const listBtn = document.getElementById('viewListBtn');

  if (mode === 'grid') {
    gridBtn.className = 'p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 transition cursor-pointer';
    listBtn.className = 'p-1.5 rounded-md text-slate-400 hover:text-slate-200 transition cursor-pointer';
  } else {
    listBtn.className = 'p-1.5 rounded-md bg-emerald-500/20 text-emerald-400 transition cursor-pointer';
    gridBtn.className = 'p-1.5 rounded-md text-slate-400 hover:text-slate-200 transition cursor-pointer';
  }
  renderCards();
}

// Fungsi Modal Lightbox (Quick View)
function openPreviewModal(index) {
  activePreviewIndex = index;
  updateModalContent();
  previewModal.classList.remove('hidden');
  previewModal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
  previewModal.classList.add('hidden');
  previewModal.classList.remove('flex');
  document.body.style.overflow = '';
}

function navigatePreview(step) {
  if (filteredList.length === 0) return;
  activePreviewIndex = (activePreviewIndex + step + filteredList.length) % filteredList.length;
  updateModalContent();
}

function updateModalContent() {
  const item = filteredList[activePreviewIndex];
  if (!item) return;

  const imgSrc = `asset/img/${item.slug}.jpg`;
  const cdrHref = `asset/file/${item.slug}.cdr`;
  const fallbackImg = `https://placehold.co/600x600/0f172a/22c55e?text=${encodeURIComponent(item.name)}`;

  document.getElementById('modalBadge').textContent = formatBadge(item.cat);
  document.getElementById('modalTitle').textContent = item.name;
  document.getElementById('modalFilename').textContent = `${item.slug}.cdr`;
  document.getElementById('modalDownloadBtn').href = cdrHref;

  const modalImg = document.getElementById('modalImg');
  modalImg.onerror = function() {
    this.onerror = null;
    this.src = fallbackImg;
  };
  modalImg.src = imgSrc;
}

// Tutup modal klik di luar area atau tombol keyboard (ESC, Panah Kiri/Kanan)
previewModal.addEventListener('click', (e) => {
  if (e.target === previewModal) closePreviewModal();
});

document.addEventListener('keydown', (e) => {
  if (!previewModal.classList.contains('hidden')) {
    if (e.key === 'Escape') closePreviewModal();
    if (e.key === 'ArrowLeft') navigatePreview(-1);
    if (e.key === 'ArrowRight') navigatePreview(1);
  }
});

// Tombol Scroll to Top muncul saat halaman digulir ke bawah
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.remove('hidden');
  } else {
    scrollTopBtn.classList.add('hidden');
  }
});

// Inisialisasi awal
renderCategoryMenu();
renderCards();
