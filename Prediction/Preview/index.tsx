import PredictionCard from "./PredictionCard"
import { ScrollView } from "react-native"

export default (props:any) => {
    const handlePress = (screenName: string,params:any) => {
        props.navigation.push(screenName,params);
      };
    return (
            <>  
                <ScrollView>
                    <PredictionCard  name ={"隧道口"} percentage={20} props={props} onPress={() => handlePress("Details",{title:"隧道口",percentage : 20})} />
                    <PredictionCard  name ={"理工二道"} percentage={40} props={props} onPress={() => handlePress("Details",{title:"理工二道",percentage : 40})} />
                    <PredictionCard  name ={"管院停車場"} percentage={60} props={props} onPress={() => handlePress("Details",{title:"管院停車場",percentage : 60})} />
                    <PredictionCard  name ={"國研大樓"} percentage={60} props={props} onPress={() => handlePress("Details",{title:"國研大樓",percentage : 60})} />
                </ScrollView>
            </>
    )
}