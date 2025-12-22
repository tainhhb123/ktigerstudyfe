import { Link } from "react-router-dom";
import { BookOpen, Target, MessageSquare, CheckCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import feature1Image from "../../assets/feature_1.png";
import feature2Image from "../../assets/feature_2.png";
import feature3Image from "../../assets/feature_3.png";
import feature4Image from "../../assets/feature_4.png";
import feature5Image from "../../assets/feature_5.png";
import banner1Image from "../../assets/banner_1.png";
import banner2Image from "../../assets/banner_2.jpg";
import banner3Image from "../../assets/banner_3.png";
import banner4Image from "../../assets/banner_4.webp";

const bannerImages = [
  banner1Image,
  banner3Image,
  banner4Image
];

const features = [
  {
    title: "HỌC THEO LỘ TRÌNH",
    icon: BookOpen,
    color: "#FF6B35",
    items: [
      "Lộ trình từ Sơ cấp đến Cao cấp",
      "Học từ vựng, ngữ pháp, luyện nghe, đọc, viết đa dạng",
      "Cung cấp bài tập để rèn luyện ngay sau khi học",
      "Kho tài liệu học thuật phong phú"
    ]
  },
  {
    title: "THI THỬ TOPIK",
    icon: Target,
    color: "#FF6B35",
    items: [
      "Mô phỏng đề thi Topik theo đúng cấu trúc",
      "Làm bài thi trên website để quen với việc thi online",
      "Chấm điểm tự động và phản hồi chi tiết",
      "Theo dõi tiến độ học tập qua biểu đồ thống kê"
    ]
  },
  {
    title: "CHAT AI LUYỆN HỘI THOẠI",
    icon: MessageSquare,
    color: "#FF6B35",
    items: [
      "Luyện hội thoại với AI trong nhiều tình huống",
      "Nhận phản hồi ngay lập tức để sửa lỗi và cải thiện",
      "Phát triển kỹ năng giao tiếp Tiếng Hàn tự nhiên",
      "Tự tin hơn khi nói Tiếng Hàn trong đời sống"
    ]
  }
];

const reviews = [
  {
    name: "Quang Minh",
    rating: 5,
    date: "22/01/2024",
    text: "Ứng dụng rất bổ ích cho người mới bắt đầu học tiếng Hàn. Giao diện thân thiện, dễ sử dụng, các bài học được sắp xếp khoa học."
  },
  {
    name: "Mai Trang",
    rating: 5,
    date: "15/02/2024",
    text: "Mình thích tính năng thi thử TOPIK nhất. Giúp mình làm quen với đề thi và biết được điểm yếu của mình để cải thiện."
  },
  {
    name: "Tuấn Anh",
    rating: 5,
    date: "03/03/2024",
    text: "Chat AI rất hữu ích! Mình có thể luyện nói tiếng Hàn mọi lúc mọi nơi mà không ngại sai. AI sửa lỗi rất chi tiết và dễ hiểu."
  }
];

const faqs = [
  {
    question: "K-Tiger Study là gì?",
    answer: "K-Tiger Study là nền tảng học tiếng Hàn trực tuyến toàn diện, cung cấp lộ trình từ cơ bản đến nâng cao, thi thử TOPIK và luyện hội thoại với AI."
  },
  {
    question: "K-Tiger Study có những tính năng gì nổi bật?",
    answer: "Các tính năng nổi bật bao gồm: Lộ trình học có hệ thống, Thi thử TOPIK theo chuẩn, Chat AI luyện hội thoại, Kho tài liệu phong phú và Theo dõi tiến độ học tập."
  },
  {
    question: "Học phí trên K-Tiger Study như thế nào?",
    answer: "Chúng tôi cung cấp nhiều gói học khác nhau phù hợp với nhu cầu của từng học viên. Vui lòng liên hệ để biết thêm chi tiết về học phí."
  },
  {
    question: "Tôi có thể đạt được mục tiêu nào khi dùng K-Tiger Study?",
    answer: "Bạn có thể đạt được các mục tiêu như: Giao tiếp cơ bản, Đạt chứng chỉ TOPIK, Nâng cao kỹ năng nghe-đọc-viết, Tự tin hội thoại tiếng Hàn."
  },
  {
    question: "K-Tiger Study có hỗ trợ học offline không?",
    answer: "Hiện tại K-Tiger Study chỉ hỗ trợ học trực tuyến. Bạn cần kết nối internet để truy cập các bài học và tính năng của nền tảng."
  }
];

const featuresData = [
  { title: "Nội dung phong phú", image: feature1Image },
  { title: "Lộ trình học rõ ràng", image: feature2Image },
  { title: "Bảng xếp hạng & đo lường", image: feature3Image },
  { title: "Chat AI thông minh", image: feature4Image },
  { title: "Lý thuyết và đề thi chi tiết", image: feature5Image }
];


export default function LearnHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featureIndex, setFeatureIndex] = useState(2); // Start with middle item

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const nextFeature = () => {
    setFeatureIndex((prev) => (prev + 1) % featuresData.length);
  };

  const prevFeature = () => {
    setFeatureIndex((prev) => (prev - 1 + featuresData.length) % featuresData.length);
  };

  const getCarouselClass = (index: number) => {
    const diff = index - featureIndex;
    const length = featuresData.length;
    
    // Normalize difference to handle circular array
    let normalizedDiff = diff;
    if (Math.abs(diff) > length / 2) {
      normalizedDiff = diff > 0 ? diff - length : diff + length;
    }
    
    if (normalizedDiff === 0) return 'carousel-selected';
    if (normalizedDiff === -1) return 'carousel-prev';
    if (normalizedDiff === 1) return 'carousel-next';
    if (normalizedDiff === -2) return 'carousel-prevLeftSecond';
    if (normalizedDiff === 2) return 'carousel-nextRightSecond';
    if (normalizedDiff < -2) return 'carousel-hideLeft';
    if (normalizedDiff > 2) return 'carousel-hideRight';
    return 'carousel-hideRight';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
            {bannerImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Banner ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronLeft className="w-6 h-6" style={{ color: '#FF6B35' }} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
            >
              <ChevronRight className="w-6 h-6" style={{ color: '#FF6B35' }} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TOPIK Roadmap Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: '#333' }}>
            <span style={{ color: '#FF6B35' }}>K-Tiger Study</span>: Lộ trình nhanh 3 tháng để học ngôn ngữ mastery!
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* TOPIK 1 */}
            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#FF6B35' }}>
              <div className="bg-white font-bold py-2 px-4 rounded-full inline-block mb-4" style={{ color: '#FF6B35' }}>
                TOPIK 1
              </div>
              <ul className="space-y-2 text-sm">
                <li>⭐ Nắm vững 800 từ vựng, 80 cấu trúc ngữ pháp cơ bản</li>
                <li>⭐ Xây dựng nền tảng Hán-Hàn vững chắc giao tiếp, lắng nghe, đọc, viết cơ bản</li>
                <li>⭐ Luyện nguyên âm bán âm, ghép vần âm tiết TOPIK 1</li>
                <li>⭐ Luyện bài tập ghi nhớ từ vựng, ngữ pháp cơ bản TOPIK 1</li>
                <li>⭐ Luyện bài tập nghe TOPIK 1</li>
                <li>⭐ Đạt kết quả thi đánh giá</li>
              </ul>
            </div>

            {/* TOPIK 2 */}
            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#FF6B35' }}>
              <div className="bg-white font-bold py-2 px-4 rounded-full inline-block mb-4" style={{ color: '#FF6B35' }}>
                TOPIK 2
              </div>
              <ul className="space-y-2 text-sm">
                <li>⭐ Nắm vững 1500 từ vựng, 200 cấu trúc ngữ pháp</li>
                <li>⭐ Nâng cao khả năng giao tiếp</li>
                <li>⭐ Luyện tập cấu từ nâng ngữ pháp, câu, đọc, viết từ đầu</li>
                <li>⭐ Nâng cấp cách lên từ TOPIK 1</li>
                <li>⭐ Luyện bài tập ghi nhớ từ vựng, ngữ pháp cơ bản TOPIK 2</li>
                <li>⭐ Luyện bài tập nghe TOPIK 2</li>
                <li>⭐ Đạt kết quả thi đánh giá</li>
              </ul>
            </div>

            {/* TOPIK 3 */}
            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#FF6B35' }}>
              <div className="bg-white font-bold py-2 px-4 rounded-full inline-block mb-4" style={{ color: '#FF6B35' }}>
                TOPIK 3
              </div>
              <ul className="space-y-2 text-sm">
                <li>⭐ Nắm vững 3000 từ vựng, 300 cấu trúc ngữ pháp</li>
                <li>⭐ Sử dụng tiếng Hàn trong nhiều tình huống</li>
                <li>⭐ Luyện tập cấu từ nâng ngữ pháp, câu, đọc, viết từ cơ bản đến nâng cao</li>
                <li>⭐ Phân tích cách dùng hàn từ TOPIK 3</li>
                <li>⭐ Luyện cách viết văn bản, bài luận nâng cao trình độ trong hàng ngày</li>
                <li>⭐ Luyện bài tập nghe TOPIK 3</li>
                <li>⭐ Đạt kết quả thi đánh giá</li>
              </ul>
            </div>

            {/* TOPIK 4 */}
            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#FF6B35' }}>
              <div className="bg-white font-bold py-2 px-4 rounded-full inline-block mb-4" style={{ color: '#FF6B35' }}>
                TOPIK 4
              </div>
              <ul className="space-y-2 text-sm">
                <li>⭐ Nắm vững 4500 từ vựng, 400 cấu trúc ngữ pháp</li>
                <li>⭐ Hiểu và sử dụng ngôn ngữ một cách chính xác và tự nhiên</li>
                <li>⭐ Luyện tập cấu từ nâng ngữ pháp, câu, đọc, viết TOPIK 4</li>
                <li>⭐ Nâng cao kỹ năng đọc hiểu tài liệu, bài báo</li>
                <li>⭐ Luyện viết bài luận, báo cáo chuyên sâu với TOPIK 4 theo hướng dày dặn kinh nghiệm</li>
                <li>⭐ Đạt kết quả thi đánh giá</li>
              </ul>
            </div>

            {/* TOPIK 5 */}
            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#FF6B35' }}>
              <div className="bg-white font-bold py-2 px-4 rounded-full inline-block mb-4" style={{ color: '#FF6B35' }}>
                TOPIK 5
              </div>
              <ul className="space-y-2 text-sm">
                <li>⭐ Nắm vững 6000 từ vựng, 500 cấu trúc ngữ pháp</li>
                <li>⭐ Giao tiếp thành thạo trong mọi tình huống</li>
                <li>⭐ Luyện tập cấu từ nâng ngữ pháp, câu, đọc, viết TOPIK 5</li>
                <li>⭐ Phân tích và nghiên cứu bài văn TOPIK 5</li>
                <li>⭐ Luyện viết bài luận chuyên sâu, phân tích tác phẩm văn học</li>
                <li>⭐ Mục tiêu đạt 250 điểm</li>
              </ul>
            </div>

            {/* TOPIK 6 */}
            <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: '#FF6B35' }}>
              <div className="bg-white font-bold py-2 px-4 rounded-full inline-block mb-4" style={{ color: '#FF6B35' }}>
                TOPIK 6
              </div>
              <ul className="space-y-2 text-sm">
                <li>⭐ Nắm vững 8000 từ vựng, 600 cấu trúc ngữ pháp</li>
                <li>⭐ Sử dụng tiếng Hàn như người bản ngữ</li>
                <li>⭐ Luyện tập cấu từ nâng ngữ pháp, câu, đọc, viết TOPIK 6 nâng cao</li>
                <li>⭐ Phân tích viết bài với mức độ cao nhất của TOPIK 6 nâng cao tầm hàng ngày cao</li>
                <li>⭐ Nghiên cứu văn học, văn hóa Hàn Quốc sâu sắc</li>
                <li>⭐ Chuẩn bị cho các cuộc thi, kỳ thi học bổng TOPIK 6 cao dương sâu bài</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* K-Tiger Study Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: '#333' }}>
            <span style={{ color: '#FF6B35' }}>K-Tiger Study</span>: Làm chủ tiếng Hàn từ nền tảng đến ứng dụng
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index}
                  className="rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: feature.color }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Link 
                    to={index === 0 ? "/learn/level" : index === 1 ? "/learn/topik" : "/learn/chatai"}
                    className="mt-4 inline-block bg-white font-semibold px-6 py-2 rounded-full hover:bg-gray-100 transition-colors"
                    style={{ color: '#FF6B35' }}
                  >
                    TÌM HIỂU THÊM →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Screenshots Section - Carousel Slider */}
      <section className="py-16" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#333' }}>
            Tính năng nổi bật
          </h2>
          
          {/* Carousel Container */}
          <div className="carousel-wrapper relative" style={{ height: '500px' }}>
            <div id="carousel" className="carousel-container">
              {featuresData.map((item, index) => (
                <div 
                  key={index}
                  className={`carousel-item ${getCarouselClass(index)}`}
                  onClick={() => setFeatureIndex(index)}
                >
                  <img 
                    src={item.image} 
                    alt={item.title}
                    draggable="false"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.style.backgroundColor = '#e0e0e0';
                        parent.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #666;">${item.title}</div>`;
                      }
                    }}
                  />
                  <p className="carousel-title">{item.title}</p>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevFeature}
              className="carousel-btn carousel-btn-prev"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextFeature}
              className="carousel-btn carousel-btn-next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {featuresData.map((_, index) => (
              <button
                key={index}
                onClick={() => setFeatureIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === featureIndex ? 'w-8' : 'bg-gray-300'
                }`}
                style={{ backgroundColor: index === featureIndex ? '#FF6B35' : undefined }}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link 
              to="/learn/level"
              className="inline-block text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
              style={{ backgroundColor: '#FF6B35' }}
            >
              BẮT ĐẦU HỌC NGAY
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .carousel-wrapper {
          position: relative;
          overflow: hidden;
        }
        
        .carousel-container {
          position: relative;
          height: 100%;
          width: 100%;
        }
        
        .carousel-item {
          position: absolute;
          transition: all 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
          cursor: pointer;
          top: 50%;
          border: 2px solid #ddd;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .carousel-selected {
          border: 3px solid #FF6B35;
        }
        
        .carousel-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: width 400ms;
          user-select: none;
          -webkit-user-drag: none;
          background-color: #f5f5f5;
        }
        
        .carousel-title {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          text-align: center;
          padding: 8px;
          background: rgba(255, 255, 255, 0.95);
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }
        
        .carousel-selected {
          z-index: 10;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          width: 400px;
          height: 500px;
          opacity: 1;
        }
        
        .carousel-prev {
          z-index: 5;
          left: 30%;
          transform: translateX(-50%) translateY(calc(-50% + 50px));
          width: 300px;
          height: 400px;
          opacity: 1;
        }
        
        .carousel-next {
          z-index: 5;
          left: 70%;
          transform: translateX(-50%) translateY(calc(-50% + 50px));
          width: 300px;
          height: 400px;
          opacity: 1;
        }
        
        .carousel-prevLeftSecond {
          z-index: 4;
          left: 15%;
          transform: translateX(-50%) translateY(-50%);
          width: 200px;
          height: 300px;
          opacity: 0.7;
        }
        
        .carousel-nextRightSecond {
          z-index: 4;
          left: 85%;
          transform: translateX(-50%) translateY(-50%);
          width: 200px;
          height: 300px;
          opacity: 0.7;
        }
        
        .carousel-hideLeft {
          left: 0%;
          opacity: 0;
          transform: translateX(-50%) translateY(-50%);
          width: 200px;
          height: 300px;
          z-index: 1;
        }
        
        .carousel-hideRight {
          left: 100%;
          opacity: 0;
          transform: translateX(-50%) translateY(-50%);
          width: 200px;
          height: 300px;
          z-index: 1;
        }
        
        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          width: 50px;
          height: 50px;
          background: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          transition: all 0.3s;
          color: #FF6B35;
        }
        
        .carousel-btn:hover {
          background: #f0f0f0;
          transform: translateY(-50%) scale(1.1);
        }
        
        .carousel-btn-prev {
          left: 20px;
        }
        
        .carousel-btn-next {
          right: 20px;
        }
        
        @media (max-width: 768px) {
          .carousel-selected {
            width: 280px;
            height: 400px;
          }
          .carousel-prev, .carousel-next {
            width: 200px;
            height: 300px;
          }
          .carousel-prevLeftSecond, .carousel-nextRightSecond {
            width: 150px;
            height: 220px;
            opacity: 0.5;
          }
        }
        
        @media (max-width: 768px) {
          .carousel-selected {
            width: 280px;
          }
          .carousel-prev, .carousel-next {
            width: 200px;
          }
          .carousel-prevLeftSecond, .carousel-nextRightSecond {
            width: 150px;
            opacity: 0.5;
          }
        }
      `}</style>

      {/* Goals Section */}
      <section className="py-16 text-white" style={{ backgroundColor: '#FF6B35' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            ĐẶT MỤC TIÊU LỚN TỪ NHỮNG MỤC TIÊU NHỎ
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Lộ trình chi tiết */}
            <div>
              <h3 className="text-2xl font-bold mb-4">LỘ TRÌNH CHI TIẾT</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Xác định mục tiêu Topik 1, 2 hoặc 3</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Lộ trình từ ngữ pháp cơ bản đến nâng cao</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Học từ vựng thông dụng và theo chủ đề</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Luyện tập nghe, đọc hiểu theo từng cấp độ</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Ôn luyện VIẾT và THI THỬ định kỳ</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Thực hành MỖI NGÀY đều đặn</span>
                </li>
              </ul>
            </div>

            {/* Bài tập của chúng mình đảm bảo đạt điểm cao */}
            <div>
              <h3 className="text-2xl font-bold mb-4">BÀI TẬP CỦA CHÚNG MÌNH ĐẢM BẢO ĐẠT ĐIỂM CAO</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Luyện thi TOPIK với đề mẫu chuẩn Hàn Quốc</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Bài tập ngữ pháp, câu, đọc, nghe, viết với lời giải chi tiết</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Hệ thống chấm điểm và phân tích kết quả tự động</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>Đề xuất bài tập cải thiện dựa trên điểm yếu</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                  <span>So sánh điểm số với học viên khác qua bảng xếp hạng</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    
      {/* User Reviews */}
      <section className="py-16" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#333' }}>
            Học viên nói gì về K-Tiger Study
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#FF6B35' }}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{review.name}</h4>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">{review.date}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{review.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: '#333' }}>
            CÂU HỎI THƯỜNG GẶP
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#FF6B35] transition-colors">
                <summary className="font-semibold text-lg flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: '#FF6B35' }}>
                    {index + 1}
                  </div>
                  {faq.question}
                </summary>
                <p className="mt-4 ml-11 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FF6B35' }}>
                  <span className="text-white font-bold text-xl">K</span>
                </div>
                <span className="text-xl font-bold">K-Tiger Study</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                K-Tiger Study - Ứng dụng luyện thi TOPIK chuyên biệt, giúp bạn học đúng và đạng và đạt được mục tiêu từ vựng, ngữ pháp, nghe đọc và viết theo cấu trúc của từng cấp độ. Thư viện tài nguyên kĩ thuật đa dạng và tổ chức theo lộ trình học được cơ nhận hỗi trợ lúc và lộ trình học được cơ nhận hỗi trợ từ từ người học.
              </p>
              
              <div className="mt-6">
                <p className="text-gray-400 text-sm font-semibold mb-2">Thông tin liên hệ:</p>
                <p className="text-gray-400 text-sm">📞 Hotline: (+84) 389.093.655</p>
                <p className="text-gray-400 text-sm mt-1">📧 Email: <a href="mailto:tintc.21it@vku.udn.vn" className="hover:underline" style={{ color: '#FF6B35' }}>tintc.21it@vku.udn.vn</a></p>
                <p className="text-gray-400 text-sm mt-1">📍 Địa chỉ: 57 Huỳnh Thúc Kháng, Khối phố Bàn Thạch, phường Hòa Hương, thành phố Tam Kì, tỉnh Quảng Nam</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Mọi người quan tâm</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-[#FF6B35] text-sm transition-colors">
                    ▸ Về K-Tiger Study
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-[#FF6B35] text-sm transition-colors">
                    ▸ Điều khoản & Điều kiện
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4">Liên hệ với chúng tôi</h3>
              <div className="flex gap-3">
                <a 
                  href="https://www.facebook.com/ttantai23" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://zalo.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <span className="text-white font-bold text-lg">Z</span>
                </a>
                <a 
                  href="mailto:tintc.21it@vku.udn.vn"
                  className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* App Download */}
            <div>
              <h3 className="text-lg font-bold mb-4">Tải ứng dụng</h3>
              <div className="space-y-3">
                <a 
                  href="#" 
                  className="block bg-black hover:bg-gray-900 rounded-lg px-4 py-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <div>
                      <p className="text-xs text-gray-400">Download on the</p>
                      <p className="text-sm font-semibold">App Store</p>
                    </div>
                  </div>
                </a>
                <a 
                  href="#" 
                  className="block bg-black hover:bg-gray-900 rounded-lg px-4 py-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                    </svg>
                    <div>
                      <p className="text-xs text-gray-400">GET IT ON</p>
                      <p className="text-sm font-semibold">Google Play</p>
                    </div>
                  </div>
                </a>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Ứng dụng khác</h4>
                <div className="flex gap-2">
                  <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">JLPT</span>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">TOE</span>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">TIE</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <img 
                  src="https://www.dmca.com/img/dmca-badge-w150-5x1-09.png" 
                  alt="DMCA Protected" 
                  className="w-32"
                />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 K-Tiger Study. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
