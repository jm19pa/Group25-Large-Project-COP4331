import React, { useState, useEffect } from 'react';

const API_BASE = 'http://pocketprofessors.com:5000'; // <- use your backend URL (or env var)

const CardPack: React.FC = () => {
  const [shaking, setShaking] = useState(false);
  const [showPoof, setShowPoof] = useState(false);
  const [cardImages, setCardImages] = useState<string[]>([]);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/images/poof.png";
  }, []);

  const openCardPack = async () => {
    // 1) Parse user_data to get the actual id
    const userDataRaw = localStorage.getItem("user_data");
    const tokenRaw    = localStorage.getItem("token_data");

    if (!userDataRaw || !tokenRaw) {
      console.error('Missing user_data or token_data in localStorage');
      return [];
    }

    const { id: userId } = JSON.parse(userDataRaw);
    const jwtToken = tokenRaw; // you stored the token itself in token_data

    const packName = "BaseSet";

    console.log('Sending to API:', { userId, jwtToken, packName });

    try {
      const response = await fetch(`${API_BASE}/api/openPack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, jwtToken, packName }),
      });

      const text = await response.text();
      if (!response.ok || !text) {
        console.error('Bad response:', response.status, text);
        return [];
      }

      const result = JSON.parse(text);
      console.log('Raw result:', result);

      if (result.error) {
        console.error("Pack error:", result.error);
        return [];
      }

      // Save refreshed token under the SAME key you read from
      localStorage.setItem("token_data", result.jwtToken);

      // result.addedCards = [{ Card: 'RickleEX', Rarity: 3 }, ...]
      const cardNames: string[] = result.addedCards.map((c: any) => c.Card);
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
        const cards = await openCardPack();
        console.log("Received cards:", cards);

        setCardImages(cards); // These are the card names, like "RickleEX"

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
      <h2>Card Pack</h2>
      <p>This is where the card pack will be displayed.</p>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src="/images/card.jpg"
          alt="Card Pack"
          height={282}
          width={200}
          onClick={handleClick}
          className={shaking ? 'shake' : ''}
          style={{ cursor: 'pointer' }}
        />

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

        {showCards && (
  <div className="card-spread">
    {cardImages.map((cardName, i) => (
      <img
        key={i}
        src={`/images/${cardName}.png`}
        className={`fan ${i === 0 ? "left" : i === 1 ? "center" : "right"}`}
        alt={`Card ${i}`}
        onError={() => console.error("Could not load image:", cardName)}
      />
    ))}
  </div>
)}

      </div>

      <br /><br />
      <button
        type="button"
        className="buttons"
        onClick={goToLoggedInPage}
      >
        Cards Page
      </button>
    </div>
  );
};

export default CardPack;
