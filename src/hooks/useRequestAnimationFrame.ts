import { useEffect, useState} from "react";

export const useRequestAnimationFrame = ()=>{
    const [lastUpdateUI, setLastUpdateUI] = useState(Date.now());

useEffect(()=>{
    let animationNumber = 0;
    const animate =()=> {
        let delta = Date.now() - lastUpdateUI;
        if(delta >= 1000 / 60) {
            // call UPDATE UI with the batched data (setState)
            setLastUpdateUI(Date.now);
        }
        animationNumber = requestAnimationFrame(animate);
    }
    animate();
    return ()=>{
        cancelAnimationFrame(animationNumber);
    }
},[]);
return lastUpdateUI;
}