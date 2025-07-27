import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './cardDex.css';

function buildCards(owned: boolean, cardFilenames: string[]) {
  return cardFilenames.map((filename, i) => (
    <div className={`card ${owned ? '' : 'card_disabled'}`} id={`card_${i}`} key={i}>
      <img
        src={`/images/${filename}`}
        alt={`Card ${i}`}
        className="card-img"
        loading="lazy"
        onError={() => console.warn("Missing image:", filename)}
      />
    </div>
  ));
}

function DexPage() {
  const [ownedCards, setOwnedCards] = useState<string[]>([]);
  const [unownedCards, setUnownedCards] = useState<string[]>([]);
  const navigate = useNavigate();

  const cardFilenames = [
    "TheGorillaEX.png", "KnightroEX.png", "CitronautEX.png", "TouchGrass.png",
    "DavidGusmao.png", "JuanoPinero.png", "TylerTran.png", "TylerTakimoto.png",
    "AndrewChambers.png", "MrPappasSHINY.png", "GUHAEX.png", "BurgerEX.png",
    "GerbEX.png", "AhmedEX.png", "AlaGazzamEX.png", "DuckerEX.png", "McalpinEX.png",
    "OnlineOliverEX.png", "RecordReggieEX.png", "ZacharyCoreEX.png", "TextbookTerryEX.png",
    "FinalFrankEX.png", "GrettaPAnderson.png", "MorrelMiddleson.png", "ProfessorPythor.png",
    "LeonardoLeeve.png", "OpenOrpheus.png", "NedNightly.png", "CrazyCarlos.png",
    "TeddTalkerson.png", "StuckStan.png", "RickleEX.png", "LateLenny.png",
    "AshLeep.png", "MrPappas.png", "RuthMyaProsef.png", "WithdrawalDate.png",
    "StudyRoom.png", "StudyGroup.png", "MyUCF.png", "EnergyDrink.png",
    "PiggyBank.png", "BadTextbook.png", "SpiritSplash.png"
  ];

  useEffect(() => {
    const fetchCards = async () => {
      const userRaw = localStorage.getItem("user_data");
      const token = localStorage.getItem("token_data");

      if (!userRaw || !token) {
        console.error("Missing user_data or token_data for card dex");
        navigate('/register');
        return;
      }

      const { id: userID } = JSON.parse(userRaw);

      try {
        // Fetch owned cards
        const ownedRes = await fetch("http://pocketprofessors.com:5000/api/foundCards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID, jwtToken: token })
        });

        const ownedData = await ownedRes.json();

        if (!ownedData.error && Array.isArray(ownedData.cards)) {
          const ownedSet = new Set(
            ownedData.cards.map((c: string) =>
              c.toLowerCase().endsWith('.png') ? c : `${c}.png`
            )
          );

          const sortedOwned = cardFilenames.filter(name => ownedSet.has(name));
          setOwnedCards(sortedOwned);

          const refreshed = ownedData.jwtToken?.accessToken || ownedData.jwtToken;
          if (refreshed) localStorage.setItem("token_data", refreshed);
        } else {
          console.error("Owned cards error:", ownedData.error);
        }

        // Fetch unowned cards
        const unownedRes = await fetch("http://pocketprofessors.com:5000/api/unfoundCards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID, jwtToken: token })
        });

        const unownedData = await unownedRes.json();

        if (!unownedData.error && Array.isArray(unownedData.missingCards)) {
          const unownedSet = new Set(
            unownedData.missingCards.map((c: string) =>
              c.toLowerCase().endsWith('.png') ? c : `${c}.png`
            )
          );

          const sortedUnowned = cardFilenames.filter(name => unownedSet.has(name));
          setUnownedCards(sortedUnowned);

          const refreshed2 = unownedData.jwtToken?.accessToken || unownedData.jwtToken;
          if (refreshed2) localStorage.setItem("token_data", refreshed2);
        } else {
          console.error("Unowned cards error:", unownedData.error);
        }

      } catch (err) {
        console.error("API call failed:", err);
      }
    };

    fetchCards();
  }, [navigate]);

  return (
    <div className='page'>
      <div className='cardDex_container'>
        <h1 className='cardDex_title'>Professor Panel</h1>

        <h2>Owned Cards</h2>
        <div className="cardGrid">
          {buildCards(true, ownedCards)}
        </div>

        <h2>Not yet Owned</h2>
        <div className="cardGrid">
          {buildCards(false, unownedCards)}
        </div>
      </div>
    </div>
  );
}

export default DexPage;
