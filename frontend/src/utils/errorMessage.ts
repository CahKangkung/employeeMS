import axios from 'axios';

export function getErrorMessage(err: unknown): string {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data as { error?: string } | undefined;

        // Prioritas 1: pesan custom dari backend (kalau ada)
        if (data?.error) return data.error;

        // Prioritas 2: fallback pesan ramah berdasarkan status code
        switch (err.response?.status) {
            case 401:
            return 'Sesi kamu sudah berakhir, silakan login ulang.';
            case 403:
            return 'Kamu tidak memiliki izin untuk melakukan aksi ini.';
            case 404:
            return 'Data tidak ditemukan.';
            case 409:
            return 'Data yang dimasukkan sudah ada'
            case 429:
            return 'Terlalu banyak percobaan, coba lagi beberapa saat.';
            case 500:
            return 'Terjadi kesalahan di server, coba lagi nanti.';
        }

        if (err.code === 'ERR_NETWORK') {
            return 'Tidak dapat terhubung ke server. Periksa koneksi internet anda';
        }
    }

    if (err instanceof Error) return err.message;
    return 'Terjadi kesalahan tidak terduga';
}