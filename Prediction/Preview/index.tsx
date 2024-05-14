import PredictionCard from "./PredictionCard"
import { ScrollView } from "react-native"

const predictionData = [
    { name: "隧道口", percentage: 20 },
    { name: "理工二道", percentage: 40 },
    { name: "管院停車場", percentage: 60 },
    { name: "國研大樓", percentage: 80 }
];
export default (props: any) => {
    const handlePress = (screenName: string, params: any) => {
        props.navigation.push(screenName, params);
    };
    return (
        <>
            <ScrollView>
                {predictionData.map((data, index) => (
                    <PredictionCard
                        key={index}
                        name={data.name}
                        percentage={data.percentage}
                        props={props}
                        onPress={() => handlePress("Details", { title: data.name, percentage: data.percentage })}
                    />
                ))}

            </ScrollView>
        </>
    )
}