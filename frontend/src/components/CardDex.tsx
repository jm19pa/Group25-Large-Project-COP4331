// create a function that automatically creates about ~20 or so card divs
import './cardDex.css'

function buildCards(){
    return Array.from({length:20}, (_, i) =>(
        <div className="card" id={`card_${i}`} key={i}>
            <p>Card {i+1}</p>
        </div>
    ));
}


function DexPage(){
    return (
        <div className='page'>
            <div className='cardDex_container'>
                <h1 className='cardDex_title'>Professor Panel</h1>
                <div className="cardGrid">
                    {buildCards()}
                </div>
            </div>
        </div>

    )
}

export default DexPage;