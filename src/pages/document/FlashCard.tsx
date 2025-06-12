//sd
import React, { useState } from 'react';
import './FlashCard.css';

type FlashCardType = {
  term: string;
  def: string;
  img: File | null;
};

const FlashCard: React.FC = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cards, setCards] = useState<FlashCardType[]>([
    { term: '', def: '', img: null },
  ]);

  const addCard = () => {
    setCards([...cards, { term: '', def: '', img: null }]);
  };

  const updateCard = (index: number, key: keyof FlashCardType, value: string | File | null) => {
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [key]: value } : card))
    );
  };

  const deleteCard = (index: number) => {
    setCards(cards.filter((_, idx) => idx !== index));
  };

  return (
    <div className="container">
      <div className="header">
        <input
          className="title-input"
          placeholder='Nhập tiêu đề, ví dụ "Sinh học - Chương 22: Tiến hóa"'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="desc-input"
          placeholder="Thêm mô tả..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
      </div>

      <div className="button-group-wrapper">
        <div className="button-group">
          <button className="btn secondary">+ Nhập</button>
          <button className="btn locked">+ Thêm sơ đồ</button>
          <button className="btn secondary">✨ Tạo từ ghi chú</button>
        </div>
        <button className="btn settingBtn" >
          ⚙️
        </button>
      </div>


      <div className="card-list">
        {cards.map((card, i) => (
          <div className="card" key={i}>
            <div className="card-index">{i + 1}</div>
            <input
              className="card-input term"
              placeholder="Thuật ngữ"
              value={card.term}
              onChange={(e) => updateCard(i, 'term', e.target.value)}
            />
            <input
              className="card-input def"
              placeholder="Định nghĩa"
              value={card.def}
              onChange={(e) => updateCard(i, 'def', e.target.value)}
            />
            <button className="img-btn" onClick={() => alert('Upload hình ảnh')}>
              🖼️ Hình ảnh
            </button>
            <button className="delete-btn" onClick={() => deleteCard(i)}>🗑️</button>
          </div>
        ))}
      </div>

      <div className="footer">
        <button className="btn secondary" onClick={addCard}>Thêm thẻ</button>
        <button className="btn primary" onClick={() => alert('Tạo & ôn luyện')}>
          Tạo và ôn luyện
        </button>
      </div>
    </div>
  );
};

export default FlashCard;
