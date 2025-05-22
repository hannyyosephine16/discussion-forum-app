# Forum Diskusi App

Aplikasi forum diskusi yang dibangun dengan React dan Redux, menggunakan Dicoding Forum API.

## Fitur Utama

### Kriteria Utama yang Dipenuhi:

1. **Fungsionalitas Aplikasi**
   - ✅ Registrasi akun pengguna
   - ✅ Login akun pengguna
   - ✅ Menampilkan daftar thread
   - ✅ Menampilkan detail thread beserta komentar
   - ✅ Membuat thread baru (memerlukan autentikasi)
   - ✅ Membuat komentar di dalam thread (memerlukan autentikasi)
   - ✅ Loading bar saat memuat data dari API

2. **Bugs Highlighting**
   - ✅ Menggunakan ESLint dengan konfigurasi AirBnB JavaScript Style Guide
   - ✅ Tidak ada error ESLint
   - ✅ Menggunakan React Strict Mode

3. **Arsitektur Aplikasi**
   - ✅ State aplikasi disimpan di Redux Store menggunakan Redux Toolkit
   - ✅ Tidak ada pemanggilan API di dalam komponen (semua di Redux actions)
   - ✅ Pemisahan kode UI dan State di folder terpisah
   - ✅ Komponen React yang modular dan reusable

### Fitur Tambahan (Saran):

1. **Fitur Votes**
   - ✅ Tombol vote untuk thread dan komentar
   - ✅ Indikasi visual saat pengguna sudah vote
   - ✅ Optimistic updates untuk UX yang lebih baik
   - ✅ Menampilkan jumlah votes

2. **Leaderboard**
   - ✅ Halaman leaderboard
   - ✅ Menampilkan nama, avatar, dan score pengguna

3. **Filter Kategori**
   - ✅ Filter thread berdasarkan kategori
   - ✅ Implementasi client-side filtering

## Struktur Proyek

```
src/
├── components/         # Komponen UI yang reusable
│   ├── auth/          # Komponen autentikasi
│   ├── common/        # Komponen umum
│   ├── comments/      # Komponen komentar
│   ├── leaderboard/   # Komponen leaderboard
│   ├── threads/       # Komponen thread
│   └── votes/         # Komponen voting
├── hooks/             # Custom React hooks
├── pages/             # Komponen halaman
├── services/          # Service untuk API calls
├── store/             # Redux store dan slices
├── styles/            # File CSS
└── utils/             # Utility functions
```

## Teknologi yang Digunakan

- **React 18** - Library UI
- **Redux Toolkit** - State management
- **React Router** - Routing
- **ESLint** - Code linting dengan AirBnB style guide
- **CSS3** - Styling dengan responsive design

## Instalasi dan Menjalankan Aplikasi

### Prerequisites

- Node.js (v14 atau lebih baru)
- npm atau yarn

### Langkah Instalasi

1. Clone atau download proyek ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan aplikasi dalam mode development:
   ```bash
   npm start
   ```

4. Buka [http://localhost:3000](http://localhost:3000) di browser

### Scripts Tersedia

- `npm start` - Menjalankan app dalam development mode
- `npm test` - Menjalankan test suite
- `npm run build` - Build app untuk production
- `npm run lint` - Menjalankan ESLint
- `npm run lint:fix` - Menjalankan ESLint dengan auto-fix

## API yang Digunakan

Aplikasi ini menggunakan **Dicoding Forum API** dengan base URL:
`https://forum-api.dicoding.dev/v1`

### Endpoint yang digunakan:
- Authentication (register, login)
- Users (profile, users list)
- Threads (CRUD operations)
- Comments (create, list)
- Votes (threads dan comments)
- Leaderboards

## Struktur State Management

Aplikasi menggunakan Redux Toolkit dengan slice-based architecture:

- **authSlice** - Mengelola state autentikasi pengguna
- **threadsSlice** - Mengelola state threads dan comments
- **usersSlice** - Mengelola state daftar pengguna
- **leaderboardSlice** - Mengelola state leaderboard
- **uiSlice** - Mengelola state UI seperti loading

## Fitur Unggulan

### 1. Optimistic Updates
- Vote pada thread dan komentar menggunakan optimistic updates
- UI langsung terupdate sebelum mendapat response dari server
- Memberikan pengalaman pengguna yang lebih responsif

### 2. Responsive Design
- Desain yang mobile-friendly
- Layout yang adaptif untuk berbagai ukuran layar

### 3. User Experience
- Loading indicators yang informatif
- Error handling yang user-friendly
- Navigation yang intuitif

### 4. Code Quality
- Mengikuti AirBnB JavaScript Style Guide
- Komponen yang modular dan reusable
- Separation of concerns yang baik

## Kontribusi

Proyek ini dibuat sebagai submission untuk kelas Dicoding. Jika ingin berkontribusi:

1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## Lisensi

Proyek ini dibuat untuk tujuan pembelajaran.