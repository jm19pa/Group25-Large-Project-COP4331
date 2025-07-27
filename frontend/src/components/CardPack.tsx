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
      localStorage.setItem("token_data", result.jwtToken.accessToken);

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

  // Fetch card names at the same time as poof
  setTimeout(async () => {
    try {
      const cards = await openCardPack();

      // Preload all card images
      await Promise.all(cards.map((cardName) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = `/images/${cardName}.png`;
          img.onload = () => resolve();
          img.onerror = () => resolve(); // still resolve on error
        });
      }));

      // Only show cards after all images are loaded
      setCardImages(cards);
      setShowCards(true);
    } catch (err) {
      console.error("Failed to open pack:", err);
    }
  }, 600);

  setTimeout(() => {
    setShowPoof(false);
  }, 1400);
};



  return (
    <div>
      <h2>Card Pack</h2>

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <img
          src="/images/card.jpg"
          alt="Card Pack"
          height={282}
          width={200}
          onClick={handleClick}
          className={shaking ? 'shake' : ''}
          style={{
            cursor: 'pointer',
            position: 'relative',
            zIndex: 2
          }}
        />


        {showPoof && (
  <img
    src="/images/poof.png"
    alt="poof"
    className="poof"
    style={{
      position: 'absolute',
      width: '500px',
      height: '500px',
      top: '-50px',
      left: '80%',
      transform: 'translateX(-50%)',
      pointerEvents: 'none',
      opacity: 1,
      animation: 'poofFade 0.8s ease-out forwards',
      zIndex: 5 // ⬅️ Now poof is in front of cards & pack
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
    style={{
      animationDelay: `${i === 1 ? 0 : i === 0 ? 0.1 : 0.4}s`,
      zIndex: i === 1 ? 3 : i === 0 ? 2 : 1
    }}
  />
))}


  </div>
)}

      </div>
    </div>
  );
};

export default CardPack;
