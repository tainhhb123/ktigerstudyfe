
// LearnHomePage.tsx - Trang chủ lộ trình học, theo phong cách Migii, bỏ header, trợ thủ Mia, bảng so sánh premium

import React from "react";

const levels = [
  {
    title: "Level 1",
    desc: "Nắm vững 600 từ vựng, 100 cấu trúc ngữ pháp cơ bản. Kỹ năng nghe, nói, đọc, viết nền tảng.",
    color: "bg-[#FF6B35]",
    text: "text-white",
  },
  {
    title: "Level 2",
    desc: "Nắm vững 1500 từ vựng, 200 cấu trúc ngữ pháp trung cấp. Luyện đề thi thử, phát triển kỹ năng giao tiếp.",
    color: "bg-[#FFE8DC]",
    text: "text-[#FF6B35] border border-[#FF6B35]",
  },
  {
    title: "Level 3",
    desc: "Nắm vững 3000 từ vựng, 300 cấu trúc ngữ pháp nâng cao. Luyện đề thi thử, phát triển kỹ năng học thuật.",
    color: "bg-[#4CAF50]",
    text: "text-white",
  },
  {
    title: "Level 4",
    desc: "Nắm vững 4500 từ vựng, 400 cấu trúc ngữ pháp chuyên sâu. Luyện đề thi thử, phát triển kỹ năng phân tích.",
    color: "bg-[#FFF8F0]",
    text: "text-[#333333] border border-[#BDBDBD]",
  },
  {
    title: "Level 5",
    desc: "Nắm vững 6000 từ vựng, 500 cấu trúc ngữ pháp chuyên ngành. Luyện đề thi thử, phát triển kỹ năng tổng hợp.",
    color: "bg-white",
    text: "text-[#4CAF50] border border-[#4CAF50]",
  },
  {
    title: "Level 6",
    desc: "Nắm vững 8000 từ vựng, 600 cấu trúc ngữ pháp chuyên sâu. Luyện đề thi thử, phát triển kỹ năng nghiên cứu.",
    color: "bg-[#FFF8F0]",
    text: "text-[#FF6B35] border border-[#FF6B35]",
  },
];

const features = [
  {
    title: "Lộ trình cá nhân hóa",
    desc: "Thiết kế lộ trình riêng cho bạn, phù hợp mục tiêu từng giai đoạn.",
    icon: "🎯",
  },
  {
    title: "Tăng cường ghi nhớ",
    desc: "Ôn tập thông minh, nhắc lại từ vựng và ngữ pháp quan trọng.",
    icon: "🧠",
  },
  {
    title: "Luyện phát âm chuẩn",
    desc: "Công nghệ AI hỗ trợ luyện phát âm, phản hồi tức thì.",
    icon: "🔊",
  },
  {
    title: "Theo dõi tiến độ",
    desc: "Tracking tiến độ học tập mỗi ngày, báo cáo chi tiết.",
    icon: "📈",
  },
];

const faqs = [
  {
    q: "KTigerStudy là gì?",
    a: "KTigerStudy là nền tảng luyện thi tiếng Hàn trực tuyến, cung cấp lộ trình học cá nhân hóa, bài tập đa dạng và luyện đề thi thử TOPIK.",
  },
  {
    q: "Có những tính năng nổi bật nào?",
    a: "Lộ trình cá nhân hóa, luyện phát âm AI, tracking tiến độ, bài tập chia nhỏ theo mục tiêu.",
  },
  {
    q: "Tôi có thể học miễn phí không?",
    a: "Bạn có thể học thử miễn phí một số nội dung cơ bản. Để mở khóa toàn bộ, hãy nâng cấp tài khoản.",
  },
  {
    q: "KTigerStudy phù hợp với ai?",
    a: "Phù hợp cho người mới bắt đầu đến nâng cao, luyện thi TOPIK, du học, xuất khẩu lao động, ...",
  },
];

const reviews = [
  {
    name: "Quỳnh Như",
    date: "22/12/2025",
    text: "KTigerStudy là công cụ luyện thi TOPIK vô cùng hữu ích cho học sinh như mình. Giao diện đẹp, dễ dùng, các tính năng cá nhân thiết kế rất ổn!",
  },
  {
    name: "Hà Trang",
    date: "22/12/2025",
    text: "KTigerStudy là app luyện thi mình ưng ý nhất từ trước đến nay. App có giao diện đẹp mắt, dễ sử dụng và cung cấp đầy đủ các tính năng cần thiết cho ôn thi.",
  },
  {
    name: "Tùng Bách",
    date: "22/12/2025",
    text: "KTigerStudy là app luyện thi TOPIK hữu ích, giúp mình cải thiện tiếng Hàn và tự tin giao tiếp với khách du lịch.",
  },
];


const LearnHomePage: React.FC = () => {
  const [faqOpen, setFaqOpen] = React.useState<number | null>(null);
  return (
    <div className="bg-[#FFF8F0] min-h-screen">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#FF6B35] to-[#FFE8DC] py-10 px-4 text-center relative">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#FF6B35] mb-2 drop-shadow">Bứt phá kỳ thi TOPIK cùng <span className='text-[#4CAF50]'>KTigerStudy!</span></h1>
          <div className="inline-block bg-[#4CAF50] text-white font-bold text-2xl px-8 py-2 rounded-full shadow-lg mb-4 mt-2">SALE 665K - MỞ KHÓA NGAY!</div>
          <p className="text-[#333333] text-lg">Lộ trình học nhanh, cá nhân hóa, luyện đề thi thử, phát triển toàn diện kỹ năng tiếng Hàn.</p>
        </div>
      </div>

      {/* Lộ trình học */}
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-[#FF6B35] mb-6 text-center">Lộ trình học 6 cấp độ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {levels.map((lv, idx) => (
            <div key={lv.title} className={`rounded-2xl shadow-lg p-6 ${lv.color} ${lv.text} transition-transform hover:scale-105 duration-200 border-2`}> 
              <h3 className="text-xl font-bold mb-2">{lv.title}</h3>
              <p className="text-base font-medium">{lv.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tính năng nổi bật */}
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-[#FF6B35] mb-6 text-center">Tính năng nổi bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((f, idx) => (
            <div key={f.title} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-xl transition border border-[#FFE8DC]">
              <div className="text-4xl mb-2">{f.icon}</div>
              <h4 className="font-bold text-[#FF6B35] mb-1">{f.title}</h4>
              <p className="text-[#666666] text-sm font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Đặt mục tiêu lớn từ mục tiêu nhỏ */}
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-[#FF6B35] mb-6 text-center">Đặt mục tiêu lớn từ những mục tiêu nhỏ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow p-6 border border-[#FFE8DC]">
            <h4 className="font-bold text-[#4CAF50] mb-2">Lộ trình chi tiết</h4>
            <ul className="list-disc pl-5 text-[#666666] text-sm space-y-1">
              <li>Mở khóa toàn bộ bài tập, đề thi</li>
              <li>Lộ trình học rõ ràng, tracking tiến độ từng ngày</li>
              <li>Thiết kế theo trình độ và mục tiêu cá nhân</li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 border border-[#FFE8DC]">
            <h4 className="font-bold text-[#FF6B35] mb-2">Bài tập chia nhỏ dạng bài</h4>
            <ul className="list-disc pl-5 text-[#666666] text-sm space-y-1">
              <li>Luyện tập 4 phần: Từ vựng, ngữ pháp, đọc hiểu, nghe hiểu</li>
              <li>Bài tập đa dạng, phù hợp từng mục tiêu nhỏ</li>
              <li>Tracking tiến độ theo ngày</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Đánh giá học viên */}
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-[#FF6B35] mb-6 text-center">Học viên nói gì về KTigerStudy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, idx) => (
            <div key={r.name} className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center border border-[#FFE8DC]">
              <div className="w-12 h-12 rounded-full bg-[#FF6B35] flex items-center justify-center text-white text-xl font-bold mb-2">{r.name[0]}</div>
              <div className="font-semibold text-[#FF6B35]">{r.name}</div>
              <div className="text-xs text-[#999999] mb-2">{r.date}</div>
              <p className="text-[#666666] text-sm font-medium">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-5xl mx-auto py-10 px-4">
        <h2 className="text-2xl font-bold text-[#FF6B35] mb-6 text-center">Câu hỏi thường gặp</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={faq.q} className="bg-white rounded-2xl shadow p-4 border border-[#FFE8DC]">
              <button
                className="w-full flex justify-between items-center text-left font-semibold text-[#FF6B35] text-base focus:outline-none"
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
              >
                <span>{faq.q}</span>
                <span>{faqOpen === idx ? "-" : "+"}</span>
              </button>
              {faqOpen === idx && (
                <div className="mt-2 text-[#666666] text-sm border-t pt-2">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LearnHomePage;
