import React from "react";
import { Text } from "react-native";
import { Verse } from "../shared/types";
import SuperScript from "./superscript";

interface ScriptureProps {
    json: string;
}

const Scripture: React.FC<ScriptureProps> = (props: ScriptureProps) => {


    console.log(props.json)
    try {
        let parsedData: Verse[] = JSON.parse(props.json) as Verse[];
        return (
            <Text style={{fontSize:18}} >
                {parsedData.map((verse, index) => (
                    <>
                    <SuperScript value={verse.VerseNumber}/>{verse.Scripture}
                    </>
                ))}
            </Text>
        )
    } catch (error) {
        // console.error('Error parsing JSON:', error);
        return (<></>)
    }
}

export default Scripture;