import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './cardDex.css';

function buildCards(owned: boolean, cardFilenames: string[]) {
    
    // for(let i = 0; i < cardFilenames.length; i++){
    //     if(!cardFilenames[i].endsWith(".png")){
    //         cardFilenames[i] += ".png";
    //     }
    // }
    
    return cardFilenames.map((filename, i) => (
        <div
            className={`card ${owned ? '' : 'card_disabled'}`}
            id={`card_${i}`}
            key={i}
        >
            <img
                src={`/images/${filename}.png`}
                alt={`Card ${i}`}
                className="card-img"
            />
        </div>
    ));
}


function DexPage(){

    const [ownedCards, setOwnedCards] = useState<string[]>([]);
    const [unownedCards, setUnownedCards] = useState<string[]>([]);
    const navigate = useNavigate();

    // this is going to look ugly
    const cardFilenames = [
        "TheGorillaEX.png",        // Gorilla
        "KnightroEX.png",          // Knightro
        "CitronautEX.png",         // Citronaut
        "TouchGrass.png",          // Touch Grass
        "DavidGusmao.png",         // David
        "JuanPinero.png",          // Juan
        "TylerTran.png",           // Tyler
        "TylerTakimoto.png",       // Tyler
        "AndrewChambers.png",      // Andrew
        "MrPappasSHINY.png",       // Shiny Pappas
        // rest of the same, unchanged
        "GUHAEX.png",
        "BurgerEX.png",
        "GerbEX.png",
        "AhmedEX.png",
        "AlaGazzamEX.png",
        "DuckerEX.png",
        "McalpinEX.png",
        "OnlineOliverEX.png",
        "RecordReggieEX.png",
        "ZacharyCoreEX.png",
        "TextbookTerryEX.png",
        "FinalFrankEX.png",
        "GrettaPAnderson.png",
        "MorrelMiddleson.png",
        "ProfessorPythor.png",
        "LeonardoLeeve.png",
        "OpenOrpheus.png",
        "NedNightly.png",
        "CrazyCarlos.png",
        "TeddTalkerson.png",
        "StuckStan.png",
        "RickleEX.png",
        "LateLenny.png",
        "AshLeep.png",
        "MrPappas.png",
        "RuthMyaProsef.png",
        "WithdrawalDate.png",
        "StudyRoom.png",
        "StudyGroup.png",
        "MyUCF.png",
        "EnergyDrink.png",
        "PiggyBank.png",
        "BadTextbook.png",
        "SpiritSplash.png"
    ]

    
    useEffect(() => {
        const fetchCards = async() => {
            const userID = localStorage.getItem("user_data");
            const jwtToken = localStorage.getItem("token_data");

            if(!userID || !jwtToken){
                console.error("Missing userID or token for card dex");
                navigate('/register');
                return;
            }

            try{
                const ownedRes = await fetch("http://pocketprofessors.com:5000/api/foundCards", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({userID, jwtToken}),
                });

                const ownedData = await ownedRes.json();

                if(!ownedData.error){
                    setOwnedCards(ownedData.cards);
                    console.log("Owned cards data: ", ownedCards);
                    localStorage.setItem("token", ownedData.jwtToken);
                }
                else{
                    console.error("Owned cards error: ", ownedData.error);
                }

                const unownedRes = await fetch("http://pocketprofessors.com:5000/api/unfoundCards", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({userID, jwtToken}),
                });

                const unownedData = await unownedRes.json();

                if(!unownedData.error){
                    setUnownedCards(unownedData.missingCards);
                    localStorage.setItem("token", unownedData.jwtToken);
                }
                else{
                    console.error("Unowned cards error: ", unownedData.error);
                }                

                console.log("ownedCards: ", ownedCards);
                console.log("unownedCards: ", unownedCards);

                console.log("ownedData.jwtToken: ", ownedData.jwtToken);
                console.log("unownedData.jwtToken: ", unownedData.jwtToken);

                console.log("ownedData.cards: ", ownedData.cards);
                console.log("unownedData.missingCards: ", unownedData.missingCards);
            }
            catch (err){
                console.error("API call failed: ", err);
            }
        };

        fetchCards();
    }, [navigate])

    return (
        <div className='page'>
            <div className='cardDex_container'>
                <h1 className='cardDex_title'>Professor Panel</h1>
                
                <h2>Owned Cards</h2>

                <div className="cardGrid">
                    {buildCards(true, ownedCards)}
                    {/* {buildCards(true, cardFilenames)} */}
                </div>

                <h2>Not yet Owned</h2>

                <div className="cardGrid">
                    {buildCards(false, unownedCards)}
                    {/* {buildCards(false, cardFilenames)} */}
                </div>
            </div>
        </div>

    )
}

export default DexPage;