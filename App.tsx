    import React from 'react';
    import { StyleSheet, Text, View ,FlatList ,Dimensions ,NativeSyntheticEvent ,NativeScrollEvent, TouchableOpacity } from 'react-native';
    
    const cell = 4

    export default function App() {

    //最初のデータ定義部分
    const times = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','20:00','8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','20:00',]
    const weeks = ['月','火','水','木','金','土','日']
    const date:number[] = []
    for (let index = 1; index <= 7; index++) {
        date.push(index)
    }

    const gridRef = React.useRef<FlatList>(null);
    const timeRef = React.useRef<FlatList>(null);
    const dateRef = [React.useRef<FlatList>(null),React.useRef<FlatList>(null),React.useRef<FlatList>(null)]
    
    //timeとスケジュールのグリッドを合わせる部分
    const onScroll = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
        timeRef.current?.scrollToOffset({
            offset:event.nativeEvent.contentOffset.y,
            animated: false,
        });
            for (let index = 0; index < 3; index++) {
                dateRef[index].current?.scrollToOffset({
                offset:event.nativeEvent.contentOffset.y,
                animated: false,
            });
        }
    }


    // １ヶ月分のスケジュールグリッド
    const dateFlatList = (index: number,color? : string) => {
        return (
            <View>

                {/* 日付 */}
                <View style={styles.dateContainer}>
                    {date.map((item) => {
                        return (
                            <View style={styles.dateTextContainer}><Text style={styles.dateText}>{item}</Text></View>
                        )
                    })}
                </View>

                <FlatList
                    ref={dateRef[index]}
                    data={date}
                    style={styles.dateFlatList}
                    numColumns={7}
                    keyExtractor={(_, index) => `${index}`}
                    scrollEventThrottle={16}
                    onScrollToIndexFailed={() => console.log("error")}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    onScroll={(event) =>
                        onScroll(event)
                    }
                    renderItem={({item}) => {
                    return (
                        <View style={[styles.gridContainer, { backgroundColor: color }]}>
                            {times.map((_,index) => {
                                return (
                                    <TouchableOpacity style = {[styles.gridTextContainer,index % 2 == 0 ? styles.gridOdd:{}]}><Text>{item.item}</Text></TouchableOpacity>
                                )
                            })}
                        </View>
                    )
                    }}
                />
            </View>
        )
    }

    //初期設定
    //３ヶ月分のスケジュールグリッドを定義
    const [views, setViews] = React.useState<{element: JSX.Element,id: number}[]>([{element: dateFlatList(0),id: 0},{element: dateFlatList(1),id: 1},{element: dateFlatList(2),id: 2}])
    
    //スケジュールグリッドの横スクロールの処理
    const onMomentumScrollEnd = (item:NativeSyntheticEvent<NativeScrollEvent>) => {

        //スケジュールのグリッドの末端を検知
        //末端に１ヶ月分のスケジュールグリッドを追加
        //先頭の１ヶ月分のスケジュールグリッドを削除
        //Viewを中央に再配置
        if (Math.round(item.nativeEvent.contentOffset.x / DATE_WIDTH) == 2) {
            const newViews: { element: JSX.Element, id: number }[] = [...views];
            newViews.shift()
            newViews.push({ element: dateFlatList(2), id: views[views.length - 1].id + 1 })
            newViews[1] = { element: dateFlatList(1), id: views[1].id }
            newViews[0] = { element: dateFlatList(0), id: views[0].id }
            setViews(newViews)
            gridRef.current?.scrollToOffset({ animated: false, offset: item.nativeEvent.contentOffset.x - DATE_WIDTH * 3 })
            gridRef.current?.scrollToIndex({animated: false,index: 1})
            console.log("末端のid========>", newViews[2].id)
            console.log("先頭のid========>",newViews[0].id)

        }
        //スケジュールのグリッドの先頭を検知
        //末端に１ヶ月分のスケジュールグリッドを削除
        //先頭の１ヶ月分のスケジュールグリッドを追加
        //Viewを中央に再配置
        else if (Math.round(item.nativeEvent.contentOffset.x / DATE_WIDTH) == 0) {
            const newViews: { element: JSX.Element, id: number }[] = [...views];
            newViews.pop()
            newViews.unshift({ element: dateFlatList(0), id: views[0].id - 1 })
            newViews[2] = { element: dateFlatList(2), id: views[2].id }
            newViews[1] = { element: dateFlatList(1), id: views[1].id }
            setViews(newViews)
            gridRef.current?.scrollToIndex({ animated: false, index: 1 })
            console.log("末端のid========>", newViews[2].id)
            console.log("先頭のid========>",newViews[0].id)
        }
    }

    return (
        <View style={styles.container}>

            {/* 曜日 */}
            <View style={styles.weekContainer}>
                {weeks.map((item) => {
                    return (
                        <View style={styles.weekTextContainer}><Text style={styles.dateText}>{item}</Text></View>
                    )
                })}
            </View>

            <View style={styles.bottomContainer}>

                {/* 15分単位の時間 */}
                <FlatList
                    ref={timeRef}
                    data={times}
                    style = {styles.timeContainer}
                    keyExtractor={(_, index) => `${index}`}
                    scrollEventThrottle={16}
                    onScrollToIndexFailed={() => console.log("error")}
                    onScroll={(event) => onScroll(event)}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({item,index}) => {
                        return (
                            <View style = {[styles.timeTextContainer,index % 2 == 0 ? styles.gridOdd : {}]}><Text style={styles.timeText}>{item}</Text></View>
                        )
                    }}
                />

                {/* ３ヶ月分のスケジュールグリッド */}
                <FlatList
                    data={views}
                    ref={gridRef}
                    style = {styles.gridFlatList}
                    snapToInterval={DATE_WIDTH}
                    decelerationRate={0.6}
                    onScrollToIndexFailed={() => console.log("error")}
                    horizontal
                    initialScrollIndex={1}
                    onMomentumScrollEnd={(item) => onMomentumScrollEnd(item)}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_,index) => `${index}`}
                    renderItem={(item) => {
                        return (<>{item.item.element}</>)
                    }}
                />
            </View>

        </View>
    );
    }

    const DATE_WIDTH = Dimensions.get('screen').width * 308 / 375;
    const TIME_WIDTH = Dimensions.get('screen').width * (375 - 308) / 375;
    const WEEK_HEIGHT = Dimensions.get('screen').height * 32 / 812;
    const GRID_HEIGHT = Dimensions.get('screen').height * 44 / 812;
    const GRID_WIDTH = DATE_WIDTH / 7
    const GRID_CONTAINER_HEIGHT = Dimensions.get('screen').height * 620 / 812;

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6E8EA',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingTop: 50,
    },
    weekContainer: {
        height: WEEK_HEIGHT,
        width: DATE_WIDTH,
        flexDirection: 'row',
    },
    weekTextContainer: {
        height: WEEK_HEIGHT,
        width: GRID_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekText: {
        color: 'black',
    },
    dateFlatList: {
        width: DATE_WIDTH,
        height: GRID_CONTAINER_HEIGHT,
        borderWidth: 1,
        borderColor: '#D8DDE3',
    },
    bottomContainer: {
        flexDirection: 'row',
    },
    timeContainer: {
        marginTop: GRID_HEIGHT + 2,
        width: TIME_WIDTH,
        height: GRID_CONTAINER_HEIGHT,
    },
    timeTextContainer: {
        alignItems: 'flex-end',
        paddingRight: 10,
        justifyContent: 'center',
        height: GRID_HEIGHT,
        borderBottomColor: '#D8DDE3',
        borderBottomWidth: 2,
    },
    timeText: {
        color: 'black'
    },
    dateContainer: {
        flexDirection: 'row',
        borderLeftWidth: 1,
        borderLeftColor: '#D8DDE3'
    },
    dateTextContainer: {
        height: GRID_HEIGHT,
        width: GRID_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: '#D8DDE3',
    },
    dateText: {
        color: 'black'
    },
    gridFlatList: {
        width: DATE_WIDTH,
    },
    gridContainer: {
        width: GRID_WIDTH,
    },
    gridTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: GRID_HEIGHT,
        borderColor: '#D8DDE3',
        borderWidth: 1,
    },
    gridOdd:{
        backgroundColor: '#D8DDE3'
    },
    grid: {
        height: GRID_HEIGHT,
        width: GRID_WIDTH,
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row',
    }
    });
