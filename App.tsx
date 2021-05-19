    import React from 'react';
    import { StyleSheet, Text, View ,FlatList ,Dimensions ,NativeSyntheticEvent ,NativeScrollEvent } from 'react-native';

    export default function App() {

    //最初のデータ定義部分
    const times = ['8:00','8:15','8:30','8:45','9:00','9:15','9:30','9:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','12:00','13:15','13:30',]
    const weeks = ['月','火','水','木','金','土','日']
    const date:number[] = []
    const grid:number[]= []
    for (let index = 1; index <= 600; index++) {
        grid.push(index)
    }
    for (let index = 1; index <= 28; index++) {
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
                    data={grid}
                    style={styles.dateFlatList}
                    numColumns={7 * 4}
                    keyExtractor={(_, index) => `${index}`}
                    scrollEventThrottle={1}
                    onScrollToIndexFailed={() => console.log("error")}
                    onScroll = {(event) => onScroll(event)}
                    renderItem={(item) => {
                    return (
                        <View style={[styles.grid,{backgroundColor: color}]}>
                            <Text>{item.item}</Text>
                        </View>
                    )
                    }}
                />
            </View>
        )
    }

    //初期設定
    //３ヶ月分のスケジュールグリッドを定義
    const [views, setViews] = React.useState<{element: JSX.Element,id: number}[]>([{element: dateFlatList(0),id: 0},{element: dateFlatList(1),id: 1},{element: dateFlatList(2,'white'),id: 2}])
    
    //スケジュールグリッドの横スクロールの処理
    const onMomentumScrollEnd = (item:NativeSyntheticEvent<NativeScrollEvent>) => {

        //スケジュールのグリッドの末端を検知
        //末端に１ヶ月分のスケジュールグリッドを追加
        //先頭の１ヶ月分のスケジュールグリッドを削除
        //Viewを中央に再配置
        if (Math.round(item.nativeEvent.contentOffset.x / DATE_WIDTH) == 11) {
            const newViews: {element: JSX.Element,id: number}[] = [...views];
            newViews.push({ element: dateFlatList(views[2].id + 1), id: views[views.length - 1].id + 1 })
            newViews.shift()
            setViews(newViews)
            // gridRef.current?.scrollToIndex({ animated: false, index: 1 })
            gridRef.current?.scrollToOffset({animated: false, offset: item.nativeEvent.contentOffset.x - DATE_WIDTH * 3 })
            console.log("末端に到達しました")
            console.log("末端のid========>", newViews[2].id)
            console.log("先頭のid========>",newViews[0].id)

        }
        //スケジュールのグリッドの先頭を検知
        //末端に１ヶ月分のスケジュールグリッドを削除
        //先頭の１ヶ月分のスケジュールグリッドを追加
        //Viewを中央に再配置
        else if (Math.round(item.nativeEvent.contentOffset.x / DATE_WIDTH) == 0) {
            const newViews: {element: JSX.Element,id: number}[] = [...views];
            newViews.push({ element: dateFlatList(views[0].id - 1), id: views[0].id - 1 })
            newViews.shift()
            setViews(newViews)
            gridRef.current?.scrollToIndex({ animated: false, index: 1 })
            console.log("先頭に到達しました")
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

            <View style={styles.gridContainer}>

                {/* 15分単位の時間 */}
                <FlatList
                    ref={timeRef}
                    data={times}
                    style = {styles.timeContainer}
                    keyExtractor={(_, index) => `${index}`}
                    scrollEventThrottle={1}
                    onScrollToIndexFailed={() => console.log("error")}
                    onScroll = {(event) => onScroll(event)}
                    renderItem={(item) => {
                        return (
                            <View style = {styles.timeTextContainer}><Text style={styles.timeText}>{item.item}</Text></View>
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
    const GRID_CONTAINER_HEIGHT = Dimensions.get('screen').height * 668 / 812;

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 50,
        
    },
    weekContainer: {
        height: WEEK_HEIGHT,
        width: DATE_WIDTH,
        backgroundColor: 'blue',
        flexDirection: 'row',
        borderColor: 'black',
        borderWidth: 1,
    },
    weekTextContainer: {
        height: WEEK_HEIGHT,
        width: GRID_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black',
    },
    weekText: {
        color: 'black',
    },
    dateFlatList: {
        width: DATE_WIDTH * 4,
        height: GRID_CONTAINER_HEIGHT,
        backgroundColor: 'yellow',
        borderWidth: 1,
        borderColor: 'black',
    },
    gridContainer: {
        flexDirection: 'row',
    },
    timeContainer: {
        marginTop: GRID_HEIGHT,
        width: TIME_WIDTH,
        height: GRID_CONTAINER_HEIGHT,
        backgroundColor: 'green',
    },
    timeTextContainer: {
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center',
        height: GRID_HEIGHT,
        borderColor: 'black',
        borderWidth: 1,
    },
    timeText: {
        color: 'black'
    },
    dateContainer: {
        flexDirection: 'row',
    },
    dateTextContainer: {
        height: GRID_HEIGHT,
        width: GRID_WIDTH,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'black',
    },
    dateText: {
        color: 'black'
    },
    gridFlatList: {
        width: DATE_WIDTH,
    },
    grid: {
        height: GRID_HEIGHT,
        width: GRID_WIDTH,
        backgroundColor: 'green',
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row'
    }
    });
