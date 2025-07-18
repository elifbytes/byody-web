import React from 'react';
import { Head } from '@inertiajs/react';
import  AppFooter  from '@/components/app-footer';
import { AppHeader } from '@/components/app-header'; 


export default function About() {
  return (
    <>
      <Head title="Tentang Byody" />
      <AppHeader />

      <section className="relative bg-gradient-to-br from-white via-neutral-100 to-white py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center max-w-4xl mx-auto mt-10">
        <div>
          <h2 className="text-2xl font-bold mb-2">Tentang Byody</h2>
          <p className="text-neutral-700">
            Byody adalah brand fashion asal Yogyakarta yang menjual pakaian hasil karya sendiri, mengutamakan kualitas dan kenyamanan...
          </p>
        </div>
        <img
          src="https://image.idntimes.com/post/20231218/siapa-yang-hari-ini-nonton-barbie-jugaaa-aku-pake-outfit-pink-pink-dariiii-at-weartyulip-super-lucuuuu-fb52e4f575146c4b26f6a287f1e9e689.jpg"
          alt="Produk Byody"
          className="rounded-lg shadow-md w-full h-48 object-cover"
        />
      </div>
      </section>

      {/* Highlight Section */}
      <section className="py-16 px-6 bg-white border-t">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-neutral-800 mb-4">Filosofi Kami</h2>
            <p className="text-neutral-700 mb-4">
              Byody berdiri dengan semangat *Do It Yourself*, mengangkat potensi lokal menjadi karya yang
              bisa dibanggakan. Setiap pakaian adalah perpaduan antara desain orisinal, detail rapi, dan
              proses produksi mandiri.
            </p>
            <p className="text-neutral-700">
              Lewat sistem digital kami, semua proses produksi berjalan efisien dan terpantau dengan baik —
              tanpa menghilangkan sentuhan personal di setiap pesanan.
            </p>
          </div>
          <div className="bg-neutral-100 p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-neutral-800 mb-2">🎯 Misi Kami</h3>
            <ul className="list-disc pl-6 text-neutral-700 space-y-2">
              <li>Menghadirkan karya lokal berkualitas tinggi</li>
              <li>Memperkuat ekosistem fashion di Yogyakarta</li>
              <li>Memberdayakan produksi mandiri dan kreatif</li>
              <li>Menjadi brand yang transparan dan terpercaya</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-neutral-50 border-t">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-6">Lihat Proses Kreatif Kami</h2>
          <video
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            className="rounded-xl shadow-lg w-full"
            autoPlay
            muted
            onEnded={(e) => {
              const video = e.target as HTMLVideoElement;
              video.currentTime = 0;
              video.play();
            }}
          />
        </div>
      </section>

      <AppFooter />
    </>
  );
}
