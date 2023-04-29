import Dot from "./Dot";

function Dots({num}:any): JSX.Element {
   const dots: JSX.Element[] = [];
   for (let i = 0; i < num; i++){
      dots.push(<Dot key={i} />)
   }
   return (
      <div className={`dots${num}`}>
         {dots}
      </div>
   )
}

export default Dots;

