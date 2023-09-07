import { Button } from "@nextui-org/react";
import { Connection, Input, Output } from "@react-midi/hooks";
import useStore from "./store";
interface SelectorProps{ 
    items: Connection[];
    storeItems: string[]
}

const NewMidiSelector = ({items, storeItems}: SelectorProps): JSX.Element =>{
    const {  selectInputItem } = useStore();
  return(
    <div className = "d-flex p-2">
        {
            items.map((item, i)=>{
                return <div className="ps-2">
                    <Button 
                className = {storeItems.includes(item.id)?"bg-black":""}
                    onClick={(e)=>{
                        console.log(item.id)
                        selectInputItem(item.id)
                    }}>{item.name}</Button>
                </div>
            })
        }
    </div>
  )
}

export default NewMidiSelector
