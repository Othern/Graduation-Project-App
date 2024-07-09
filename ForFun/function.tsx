import Toast from "react-native-toast-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
const showToast = (text1: string, text2: string, type = 'forfun') => {
    Toast.show({
        type: type,
        text1: text1,
        text2: text2,
        topOffset: 65
    });
}
export const processDailyReward =(dailyReward: boolean, consume: any) => {
    if (dailyReward) {
        showToast('恭喜你獲得五顆愛心，可用於人氣比拼投票', '')
        const today =new Date();
        saveLogin(today.getMonth(),today.getDate())
        consume(false)
    }
    else {
        showToast('本日愛心已領取,請隔日再來領取', '')
    }
}

const saveLogin = (month: any, date: any) => {
    try {
        AsyncStorage.setItem('LastLoginMonth', month.toString());
        AsyncStorage.setItem('LastLoginDate', date.toString());
        AsyncStorage.setItem('Hearts', '5');
    } catch (e) {
        console.log("error", e);
    }
};
export const initHearts = async()=>{
    const hearts = await AsyncStorage.getItem('Hearts');
    if(hearts){
        return Number(hearts);
    }
    else{
        AsyncStorage.setItem('Hearts', '0');
        return 0;
    }
}
export const reviceHeart = async(heart:boolean,success:any)=>{
    const hearts = await AsyncStorage.getItem('Hearts');
    const leftover = Number(hearts) - 1;
    
    if(leftover >= 0 && !heart){
        AsyncStorage.setItem('Hearts',(Number(hearts) - 1).toString())
        success()
    }
    if(leftover < 0){
        showToast('本日愛心已使用完畢,請隔日再來領取', '')
    }
    
}

export const initDailyRewardStatus = async () => {
    try {
        const today =new Date();
        const LastLoginMonth = await AsyncStorage.getItem('LastLoginMonth');
        const LastLoginDate = await AsyncStorage.getItem('LastLoginDate');
        if(LastLoginMonth != today.getMonth().toString() || LastLoginDate != today.getDate().toString()){
            return true
        }
        else{
            return false
        }
        
        
    } catch (e) {
        console.log("error", e);
    }
};