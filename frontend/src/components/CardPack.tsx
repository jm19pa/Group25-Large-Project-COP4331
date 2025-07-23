import React, { useState, useEffect } from 'react';

const CardPack: React.FC = () => {
  const [shaking, setShaking] = useState(false);
  const [showPoof, setShowPoof] = useState(false);
  const [cardImages, setCardImages] = useState<string[]>([]);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/images/poof.png";
  }, []);

  // ✅ Function to call the backend API and return added card names
  const openCardPack = async () => {
  const userId = localStorage.getItem("userId");
  const jwtToken = localStorage.getItem("token");
  const packName = "BaseSet"; // or your pack name

  try {
    const response = await fetch("/api/openPack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, jwtToken, packName }),
    });

    const result = await response.json();

    if (result.error) {
      console.error("Pack error:", result.error);
      return [];
    }

    localStorage.setItem("token", result.jwtToken);

    const cardNames = result.addedCards.map((card: any) => card.Card);
    console.log("Cards received:", cardNames);

    return cardNames;
  } catch (err) {
    console.error("Network or parsing error:", err);
    return [];
  }
};

  const handleClick = async () => {
    setShaking(true);
    setShowCards(false);

    setTimeout(() => {
      setShaking(false);
      setShowPoof(true);
    }, 600);

    setTimeout(async () => {
      setShowPoof(false);

      try {
        const cards = await openCardPack(); // returns array of objects
        console.log("Received cards:", cards);
        const imagePaths = cards.map((card: any) => `/images/${card.Card}.png`);

        console.log("Image paths:", imagePaths); // ✅ Log paths
        setShowCards(true);
      } catch (err) {
        console.error("Failed to open pack:", err);
      }
    }, 1200);
  };

  function goToLoggedInPage() {
    window.location.href = '/cards';
  }

  return (
    <div>

      {/* ── Relative wrapper ──────────────────────────────────────────── */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Card image with shake class */}
        <img
          src="/images/card.jpg"
          alt="Card Pack"
          height={282}
          width={200}
          onClick={handleClick}
          className={shaking ? 'shake' : ''}
          style={{ cursor: 'pointer' }}
        />

        {/* Poof animation */}
        {showPoof && (
          <img
            src="/images/poof.png"
            alt="poof"
            className="poof"
            style={{
              position: 'absolute',
              width: '500px',
              height: '600px',
              top: '-100px',
              left: '80%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
              opacity: 1,
              animation: 'poofFade 0.8s ease-out forwards',
              zIndex: 1
            }}
          />
        )}

        {/* Card spread display */}
        {showCards && (
          <div className="card-spread">
            <img src={cardImages[0]} className="fan left" alt="Card 1" />
            <img src={cardImages[1]} className="fan center" alt="Card 2" />
            <img src={cardImages[2]} className="fan right" alt="Card 3" />
          </div>
        )}
      </div>

      <br /><br />
      {/* <button
        type="button"
        className="buttons"
        onClick={goToLoggedInPage}
      >
        Cards Page
      </button> */}
    </div>
  );
};

export default CardPack;
