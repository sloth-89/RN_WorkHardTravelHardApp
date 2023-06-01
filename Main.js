import { StatusBar } from "expo-status-bar";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { useEffect, useState } from "react";
import SwitchButton from "./SwichButton";
import { themeWork } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";

const STORAGE_KEY = "@toDOs";

export default function Main() {
  const { colors } = useTheme();

  // work와 travel의 탭의 상태변화 값을 담는다.
  const [working, setWorking] = useState(true);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);

  // todo list 오브젝트 상태 관리
  const [toDos, setToDos] = useState({});

  // 입력된 값의 상태 관리 (텍스트 인풋)
  const [text, setText] = useState("");
  // input에 적히는 값들을 onChangeText 라는 변수에 담는다.
  const onChangeText = (payload) => setText(payload);

  // async 스토리지
  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      // string타입을 오브젝트로 (object to string)
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

  // Todo 추가 함수
  const addTodo = async () => {
    if (text === "") {
      return;
    }
    // save todo
    const newToDos = {
      ...toDos,
      [Date.now()]: { text, working, checked },
    }; // 제일 바깥 {}가 새로운 오브젝트를 생성한다는 의미가 되고, 그 안에 toDos와 새로 들어오는 내용을 넣는다는 말이다.
    setToDos(newToDos);
    // 스토리지에 저장
    await saveToDos(newToDos);
    // 텍스트 초기화
    setText("");
  };

  // 오브젝트를 합쳐주는 함수
  // Object.assign({}, toDos, {[Date.now()]:{work:true}})

  // Todo 삭제
  // 삭제하기 위해 원래 오브젝트 복제 후 삭제하고 set
  const deleteToDo = async (key) => {
    // 아래처럼 alert를 만들어서 창을 띄어줄 수 있다.
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "I'm sure",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
      // sure에만 onPress를 넣어줌으로 상호작용은 저기에만 일어난다.
    ]);
    return;
  };

  // Todo 체크
  const checkToDo = async (key) => {
    const newToDos = { ...toDos };
    const temp = newToDos[key].checked;

    newToDos[key].checked = !temp;

    setToDos(newToDos);
    await saveToDos(newToDos);
  };

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
      <View>
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
              <View style={styles.toDo} key={key}>
                <Text
                  style={{
                    ...styles.toDoText,
                    textDecorationLine: toDos[key].checked
                      ? null
                      : "line-through",
                    color: toDos[key].checked ? "white" : themeWork.grey,
                  }}
                >
                  {toDos[key].text}
                </Text>
                <View style={styles.icon}>
                  <TouchableOpacity onPress={() => checkToDo(key)}>
                    <Fontisto
                      name="check"
                      size={20}
                      color={themeWork.grey}
                      style={{
                        marginHorizontal: 10,
                        color: toDos[key].checked ? themeWork.grey : "white",
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteToDo(key)}>
                    <Fontisto
                      name="trash"
                      size={22}
                      color={themeWork.grey}
                      style={{ marginHorizontal: 10 }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeWork.bg,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 80,
    justifyContent: "space-between",
    // CSS에는 없는 속성 : paddingHorizontal, paddingVertical로 가로, 세로 기준으로 padding 값을 줄 수 있다.
    paddingHorizontal: 10,
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
  toDo: {
    backgroundColor: themeWork.toDoBg,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: 500,
  },
  icon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
