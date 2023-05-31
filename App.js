import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import AppLightTheme from "./AppLightTheme";
import AppDarkTheme from "./AppDarkTheme";
import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";
import SwitchButton from "./SwichButton";
import { themeWork } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDOs";

export default function App() {
  // useColorSheme 는 dark, light 값을 리턴한다.
  const colorScheme = useColorScheme();

  const [theme, setTheme] = useState(colorScheme);
  const themeDate = { theme, setTheme };

  // work와 travel의 탭의 상태변화 값을 담는다.
  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  // input에 적히는 값들을 onChangeText 라는 변수에 담는다.
  const onChangeText = (payload) => setText(payload);

  // 입력된 값의 상태를 관리
  const [text, setText] = useState("");
  // toDo에 입력된 내용 관리
  const [toDos, setToDos] = useState({});

  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      alert("saving error");
    }
  };
  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      setToDos(JSON.parse(s)); // parse는 string을 javascript object로 만들어 주는 것.
    } catch (e) {
      alert("reading error");
    }
  };
  useEffect(() => {
    loadToDos();
  }, []);

  // 완료 버튼을 눌렀을 때 수행할 함수 정의
  const addTodo = async () => {
    if (text === "") {
      return;
    }
    // save to do
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working },
    }; // 제일 바깥 {}가 새로운 오브젝트를 생성한다는 의미가 되고, 그 안에 toDos와 새로 들어오는 내용을 넣는다는 말이다.
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };

  // 오브젝트를 합쳐주는 함수
  // Object.assign({}, toDos, {[Date.now()]:{work:true}})

  return (
    <ThemeContext.Provider value={themeDate}>
      <NavigationContainer
        theme={colorScheme === "light" ? AppLightTheme : AppDarkTheme}
      >
        <View style={styles.container}>
          <StatusBar style="auto" />
          <SwitchButton />
          <View style={styles.header}>
            <TouchableOpacity onPress={work}>
              <Text
                style={{
                  ...styles.btnText,
                  color: working ? "white" : themeWork.grey,
                }}
              >
                Work
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={travel}>
              <Text
                style={{
                  ...styles.btnText,
                  color: !working ? "white" : themeWork.grey,
                }}
              >
                Travel
              </Text>
            </TouchableOpacity>

            {/* 1. <TouchableOpacity> </TouchableOpacity> */}
            {/* 탭하는 이벤트를 수행할 준비가 된 View라고 생각하면 된다.(탭을 하면 약간 투명해지게 한다) */}
            {/* activeOpacity={0}로 투명도 정도 조절 가능 */}

            {/* 2. <TouchableHighlight 
              underlayColor="#dddddd"
              onPress={() => console.log("pressed")}
            > </TouchableHighlight> */}
            {/* 탭했을때 배경색이 바뀌도록 해준다. */}
            {/* onPress= - 손가락이 영역에 들어갔다 나오는 행위 */}
            {/* onPressIn= - 손가락이 영역 안에 들어갔을 때 */}
            {/* onPressOut= - 손가락이 영역을 벗어났을 때 */}
            {/* onLongPress= - 손가락이 영역에 들어가서 오랫동안 머무를 때 */}
            {/* underlayColor로 바뀔 배경색 지정 (opacity에 쓰면 좀 더 나을지도) */}
            {/* TouchableOpacity에도 적용가능 */}

            {/* 3. <TouchableWithoutFeedback> </TouchableWithoutFeedback> */}
            {/* 아무 애니메이션 효과 없이 탭 이벤트 수행 */}

            {/* 4. <pressable> </pressable> */}
            {/* 3번과 같지만 더 섬세하게 설정 가능(최신) */}
            {/* delayLongPress로 머무는 시간도 지정 가능 */}
            {/* hitSlope는 요소 바깥 어디까지 탭을 감지할지 지정 */}
          </View>
          <TextInput
            // 폰 자판의 완료(enter)버튼을 눌렀을 때 수행할 함수
            onSubmitEditing={addTodo}
            // onChange와 같다.
            onChangeText={onChangeText}
            returnKeyType="done"
            // 입력된 상태값을 받는다.
            value={text}
            style={styles.input}
            placeholder={working ? "Add a To Do" : "Where do you want to go ?"}
            // placeholderTextColor로 색 변경 가능

            // 설정 값에 따라 대문자를 자동으로 입력하게 할 수 있다.
            // autoCapitalize={"sentences"}
            // 비밀번호 입력 (땡땡이)
            // secureTextEntry
            // 여러줄로 작성
            // multiline
            // 키보드 타입 설정 (속성들은 React Native 사이트 가서 확인)
            // keyboardType='email-address'
            // 완료, 보내기 등등 엔터 부분의 타입을 설정
            // returnKeyType='send'
          />
          <ScrollView>
            {/* 오브젝트에 키를 찾아 오브젝트의 내용을 가져온다 */}
            {Object.keys(toDos).map((key) =>
              toDos[key].working === working ? (
                <View style={styles.toDos} key={key}>
                  <Text style={styles.toDoText}>{toDos[key].text}</Text>
                </View>
              ) : null
            )}
          </ScrollView>
        </View>
      </NavigationContainer>
    </ThemeContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeWork.bg,
  },
  header: {
    flexDirection: "row",
    marginTop: 80,
    justifyContent: "space-between",
    // CSS에는 없는 속성 : paddingHorizontal, paddingVertical로 가로, 세로 기준으로 padding 값을 줄 수 있다.
    paddingHorizontal: 20,
  },
  btnText: {
    fontSize: 38,
    fontWeight: 600,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDos: {
    backgroundColor: themeWork.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: 500,
  },
});
