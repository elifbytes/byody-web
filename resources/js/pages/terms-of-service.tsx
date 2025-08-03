import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import Heading from '@/components/heading';
import { Card } from '@/components/ui/card';

export default function TermsOfService() {
    return (
        <AppLayout>
            <Head title="Terms of Service - Byody" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold">Terms of Service</h1>
                    <p className="text-gray-600 text-lg">
                        Syarat dan ketentuan penggunaan layanan Byody
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </p>
                </div>

                <Card className="p-8">
                    <div className="prose prose-gray max-w-none">
                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">1. Penerimaan Syarat</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Dengan mengakses dan menggunakan website Byody, Anda menyetujui untuk terikat oleh syarat dan ketentuan ini. 
                                Jika Anda tidak menyetujui syarat dan ketentuan ini, mohon untuk tidak menggunakan layanan kami.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">2. Tentang Byody</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Byody adalah toko online yang menjual produk fashion berkualitas tinggi. Kami berkomitmen untuk 
                                menyediakan produk terbaik dengan layanan pelanggan yang memuaskan.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">3. Produk dan Harga</h2>
                            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
                                <li>Semua produk yang ditampilkan di website adalah produk asli Byody</li>
                                <li>Harga produk dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya</li>
                                <li>Warna produk yang ditampilkan mungkin sedikit berbeda dengan aslinya karena pengaturan monitor</li>
                                <li>Ketersediaan stok produk akan diupdate secara real-time</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">4. Pemesanan dan Pembayaran</h2>
                            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
                                <li>Pesanan dianggap sah setelah pembayaran dikonfirmasi</li>
                                <li>Kami menerima pembayaran melalui transfer bank, e-wallet, dan kartu kredit</li>
                                <li>Pembayaran harus dilakukan dalam waktu 24 jam setelah pemesanan</li>
                                <li>Pesanan yang tidak dibayar dalam batas waktu akan otomatis dibatalkan</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">5. Pengiriman</h2>
                            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
                                <li>Pengiriman dilakukan melalui jasa ekspedisi terpercaya</li>
                                <li>Waktu pengiriman tergantung pada lokasi tujuan dan jasa ekspedisi yang dipilih</li>
                                <li>Risiko kerusakan atau kehilangan selama pengiriman menjadi tanggung jawab ekspedisi</li>
                                <li>Byody tidak bertanggung jawab atas keterlambatan pengiriman yang disebabkan oleh faktor eksternal</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">6. Pengembalian dan Penukaran</h2>
                            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
                                <li>Pengembalian dapat dilakukan dalam waktu 7 hari setelah produk diterima</li>
                                <li>Produk harus dalam kondisi baru, belum dicuci, dan masih memiliki tag</li>
                                <li>Biaya pengiriman untuk pengembalian ditanggung oleh pembeli</li>
                                <li>Pengembalian karena kesalahan dari pihak kami akan ditanggung sepenuhnya oleh Byody</li>
                                <li>Proses refund akan dilakukan dalam waktu 3-7 hari kerja setelah produk diterima kembali</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">7. Privasi dan Data Pribadi</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. 
                                Informasi yang Anda berikan akan digunakan untuk memproses pesanan dan meningkatkan layanan kami. 
                                Kami tidak akan membagikan data pribadi Anda kepada pihak ketiga tanpa persetujuan Anda.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">8. Hak Kekayaan Intelektual</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Semua konten di website Byody, termasuk namun tidak terbatas pada teks, gambar, logo, dan desain, 
                                adalah milik Byody dan dilindungi oleh hak cipta. Penggunaan konten tanpa izin tertulis dilarang keras.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">9. Pembatasan Tanggung Jawab</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Byody tidak bertanggung jawab atas kerugian langsung atau tidak langsung yang timbul dari 
                                penggunaan website atau produk kami, kecuali yang diwajibkan oleh hukum yang berlaku.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">10. Perubahan Syarat dan Ketentuan</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Byody berhak untuk mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan 
                                diberitahukan melalui website dan berlaku efektif setelah dipublikasikan.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">11. Hukum yang Berlaku</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Setiap sengketa yang timbul 
                                akan diselesaikan melalui pengadilan yang berwenang di Indonesia.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold mb-4">12. Kontak</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Jika Anda memiliki pertanyaan mengenai syarat dan ketentuan ini, silakan hubungi kami melalui:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 leading-relaxed space-y-2">
                                <li>Email: support@byody.com</li>
                                <li>WhatsApp: +62 812-3456-789</li>
                                <li>Website: www.byody.com</li>
                            </ul>
                        </section>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}