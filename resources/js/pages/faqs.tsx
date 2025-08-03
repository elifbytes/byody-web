import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card } from '@/components/ui/card';

// Simple Chevron Down Icon component
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

// FAQ Data
const faqData = [
  {
    id: 1,
    question: "Bagaimana cara melakukan pemesanan?",
    answer: "Anda dapat melakukan pemesanan dengan mudah melalui website kami. Pilih produk yang diinginkan, tambahkan ke keranjang, lalu lanjutkan ke proses checkout. Kami menerima berbagai metode pembayaran untuk kemudahan Anda."
  },
  {
    id: 2,
    question: "Berapa lama waktu pengiriman?",
    answer: "Waktu pengiriman bervariasi tergantung lokasi Anda. Untuk area Jabodetabek, pengiriman memakan waktu 1-2 hari kerja. Untuk luar Jabodetabek, pengiriman memakan waktu 2-5 hari kerja. Kami akan memberikan nomor resi untuk tracking paket Anda."
  },
  {
    id: 3,
    question: "Apakah ada garansi untuk produk?",
    answer: "Ya, semua produk Byody memiliki garansi kualitas. Jika ada kerusakan atau cacat produksi, Anda dapat mengembalikan produk dalam waktu 7 hari setelah penerimaan dengan kondisi produk masih dalam keadaan baik dan belum digunakan."
  },
  {
    id: 4,
    question: "Bagaimana cara mengetahui ukuran yang tepat?",
    answer: "Kami menyediakan size chart lengkap di setiap halaman produk. Anda juga dapat menghubungi customer service kami untuk konsultasi ukuran. Kami merekomendasikan untuk mengukur tubuh Anda terlebih dahulu sebelum melakukan pemesanan."
  },
  {
    id: 5,
    question: "Apakah bisa melakukan retur atau tukar barang?",
    answer: "Ya, kami menerima retur dan tukar barang dalam waktu 7 hari setelah penerimaan. Syaratnya adalah produk masih dalam kondisi baru, belum dicuci, dan masih memiliki tag. Biaya pengiriman retur ditanggung oleh pembeli kecuali ada kesalahan dari pihak kami."
  },
  {
    id: 6,
    question: "Bagaimana cara menghubungi customer service?",
    answer: "Anda dapat menghubungi customer service kami melalui WhatsApp di nomor yang tertera di website, email ke support@byody.com, atau melalui live chat di website kami. Tim kami siap membantu Anda dari Senin-Sabtu pukul 09.00-18.00 WIB."
  }
];

// Accordion Item Component
interface AccordionItemProps {
  faq: {
    id: number;
    question: string;
    answer: string;
  };
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ faq, isOpen, onToggle }) => {
  return (
    <Card className="mb-4 overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors duration-200">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-900 pr-4">
          {faq.question}
        </h3>
        <ChevronDownIcon 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-4 pt-2">
          <div className="border-t border-gray-100 pt-4">
            <p className="text-gray-700 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Main FAQ Component
const FAQs: React.FC = () => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const toggleAll = () => {
    if (openItems.size === faqData.length) {
      setOpenItems(new Set());
    } else {
      setOpenItems(new Set(faqData.map(faq => faq.id)));
    }
  };

  return (
    <AppLayout>
      <Head title="FAQ - Byody" />
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan yang sering diajukan tentang produk dan layanan Byody
            </p>
          </div>

          {/* Toggle All Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={toggleAll}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 border border-blue-300 hover:border-blue-400 rounded-lg transition-colors duration-200"
            >
              {openItems.size === faqData.length ? 'Tutup Semua' : 'Buka Semua'}
            </button>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-2">
            {faqData.map((faq) => (
              <AccordionItem
                key={faq.id}
                faq={faq}
                isOpen={openItems.has(faq.id)}
                onToggle={() => toggleItem(faq.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FAQs;