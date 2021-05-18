    import React from 'react';
    import { StyleSheet, Text, View ,FlatList ,ViewToken ,Dimensions ,NativeSyntheticEvent ,NativeScrollEvent } from 'react-native';

    export default function App() {

    const times = ['8:00','8:15','8:30','8:45','9:00','9:15','9:30','9:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','12:00','13:15','13:30','13:45',]
    const date= [0]
    for (let index = 1; index <= 160; index++) {
        date.push(index)
    }

    // const [index, setIndex] = React.useState(0)
    // const handleViewableItemsChanged = (info: {
    //     viewableItems: ViewToken[];
    //     changed: ViewToken[];
    // }) => {
    // if (info.viewableItems.length > 0 && info.viewableItems[0].item) {
    // }
    // };

    // const viewabilityConfigCallbackPairs = React.useRef([
    // {
    //     viewabilityConfig: {
    //     minimumViewTime: 0,
    //     viewAreaCoveragePercentThreshold: 0,
    //     waitForInteraction: true,
    //     },
    //     onViewableItemsChanged: handleViewableItemsChanged,
    // },
    // ]);

    const gridtRef = React.useRef<FlatList>(null);
    const timeRef = React.useRef<FlatList>(null);
    const dateRef = [React.useRef<FlatList>(null),React.useRef<FlatList>(null),React.useRef<FlatList>(null),React.useRef<FlatList>(null),React.useRef<FlatList>(null),React.useRef<FlatList>(null),React.useRef<FlatList>(null),React.useRef<FlatList>(null),React.useRef<FlatList>(null)]

    const dateFlatList = (index: number,color? : string) => {
        return (
            <View>

                <View>
                    <View style={styles.weekContainer}>
                        <View style={styles.weekTextContainer}><Text style={styles.weekText}>日</Text></View>
                        <View style={styles.weekTextContainer}><Text style={styles.weekText}>月</Text></View>
                        <View style={styles.weekTextContainer}><Text style={styles.weekText}>火</Text></View>
                        <View style={styles.weekTextContainer}><Text style={styles.weekText}>水</Text></View>
                        <View style={styles.weekTextContainer}><Text style={styles.weekText}>木</Text></View>
                        <View style={styles.weekTextContainer}><Text style={styles.weekText}>金</Text></View>
                        <View style={styles.weekTextContainer}><Text style={styles.weekText}>土</Text></View>
                    </View>
                    <View style={styles.dateContainer}>
                        <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>1</Text></View>
                        <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>2</Text></View>
                        <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>3</Text></View>
                        <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>4</Text></View>
                        <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>5</Text></View>
                        <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>6</Text></View>
                        <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>7</Text></View>
                    </View>
                </View>
                
                <FlatList
                    ref={dateRef[index]}
                    data={date}
                    style={styles.dateFlatList}
                    numColumns={7}
                    keyExtractor={(_, index) => `${index}`}
                    scrollEventThrottle={1}
                    onScrollToIndexFailed={() => console.log("error")}
                    onScroll={(e) => {
                        timeRef.current?.scrollToOffset({
                            offset:e.nativeEvent.contentOffset.y,
                            animated: false,
                        });
                        for (let num = 0; num < 8; num++) {
                            dateRef[num].current?.scrollToOffset({
                            offset:e.nativeEvent.contentOffset.y,
                            animated: false,
                        });
                        }
                    }}
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

    //初期カレンダーのView
    const [views, setViews] = React.useState<{element: JSX.Element,id: number}[]>([{element: dateFlatList(0),id: 0},{element: dateFlatList(1),id: 1},{element: dateFlatList(2),id: 2},{element: dateFlatList(2),id: 3},{element: dateFlatList(2),id: 4},{element: dateFlatList(2),id: 5},{element: dateFlatList(2),id: 6},{element: dateFlatList(2),id: 7},{element: dateFlatList(2),id: 8}])
    
    const onMomentumScrollEnd = (item:NativeSyntheticEvent<NativeScrollEvent>) => {
        
        // 画面幅から今のindexを取得
        const nowIndex = Math.round(item.nativeEvent.contentOffset.x / DATE_WIDTH)


        // もし末端にたどり着いたら末端に＋４
        if (nowIndex == 8) {
            // gridtRef.current?.scrollToIndex({ animated: false, index: 4 })
            // const newViews: {element: JSX.Element,id: number}[] = [...views];
            // newViews.push({ element: dateFlatList(), id: views[views.length - 1].id + 1 }, { element: dateFlatList(), id: views[views.length - 1].id + 2 }, { element: dateFlatList(), id: views[views.length - 1].id + 3 }, { element: dateFlatList(), id: views[views.length - 1].id + 4 })
            // newViews.shift()
            // newViews.shift()
            // newViews.shift()
            // newViews.shift()
            // setViews(newViews)
        }
        if (nowIndex == 0) {
            gridtRef.current?.scrollToIndex({ animated: false, index: 4 })
        }
        // if (nowIndex == 4) {
        //     console.log("=====ここが末端です")
        //     const newViews: {element: JSX.Element,id: number}[] = [...views];
        //     newViews.push({ element: dateFlatList(), id: views[views.length - 1].id + 1 }, { element: dateFlatList(), id: views[views.length - 1].id + 2 }, { element: dateFlatList(), id: views[views.length - 1].id + 3 }, { element: dateFlatList(), id: views[views.length - 1].id + 4 })
        //     newViews.shift()
        //     newViews.shift()
        //     newViews.shift()
        //     newViews.shift()
        //     gridtRef.current?.scrollToIndex({ animated: false, index: 4 })
        //     setViews(newViews)

        // } else if (nowIndex == 0) {
        //     console.log("=====ここが先頭です")
        //     const newViews: {element: JSX.Element,id: number}[] = [...views];
        //     newViews.unshift({ element: dateFlatList(), id: views[0].id - 1 }, { element: dateFlatList(), id: views[1].id - 1 }, { element: dateFlatList(), id: views[2].id - 1 }, { element: dateFlatList(), id: views[3].id - 1 });
        //     newViews.pop();
        //     newViews.pop();
        //     newViews.pop();
        //     newViews.pop();
        //     gridtRef.current?.scrollToIndex({ animated: false, index: 4 })
        //     setViews(newViews)
        // }
    }

    return (
        <View style={styles.container}>

            <View style={styles.gridContainer}>

                {/* 15分単位の時間 */}
                <FlatList
                    ref={timeRef}
                    data={times}
                    style = {styles.timeContainer}
                    keyExtractor={(_, index) => `${index}`}
                    onScrollToIndexFailed={() => console.log("error")}
                    renderItem={(item) => {
                        return (
                            <View style = {styles.timeTextContainer}><Text style={styles.timeText}>{item.item}</Text></View>
                        )
                    }}
                />

                {/* スケジュールのグリッド */}
                <FlatList
                    ref = {gridtRef}
                    snapToInterval={DATE_WIDTH}
                    // viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    data={views}
                    decelerationRate={0.6}
                    horizontal
                    initialScrollIndex={4}
                    scrollEventThrottle={1500}
                    onScrollToIndexFailed={() => console.log("error")}
                    snapToEnd={true}
                    indicatorStyle={"black"}
                    onMomentumScrollEnd = {(item) => onMomentumScrollEnd(item)}
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
    const TIME_WIDTH = Dimensions.get('screen').width * (375 - 290) / 375;
    const WEEK_HEIGHT = Dimensions.get('screen').height * 32 / 812;
    const GRID_HEIGHT = Dimensions.get('screen').height * 44 / 812;
    const GRID_WIDTH = Dimensions.get('screen').width * 44 / 375
    const GRID_CONTAINER_HEIGHT = Dimensions.get('screen').height * 668 / 812;

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    weekContainer: {
        height: WEEK_HEIGHT,
        width: DATE_WIDTH,
        backgroundColor: 'blue',
        flexDirection: 'row'
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
        width: DATE_WIDTH,
        height: GRID_CONTAINER_HEIGHT,
        backgroundColor: 'yellow',
        borderWidth: 1,
        borderColor: 'black',
    },
    gridContainer: {
        flexDirection: 'row',
    },
    timeContainer: {
        marginTop: GRID_HEIGHT + WEEK_HEIGHT,
        width: TIME_WIDTH,
        height: GRID_CONTAINER_HEIGHT,
        backgroundColor: 'green'
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
        flexDirection: 'row'
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
    grid: {
        height: GRID_HEIGHT,
        width: GRID_WIDTH,
        backgroundColor: 'green',
        borderWidth: 1,
        borderColor: 'black',
        flexDirection: 'row'
    }
    });
