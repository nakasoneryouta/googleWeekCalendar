    import { StatusBar } from 'expo-status-bar';
    import React from 'react';
    import { StyleSheet, Text, View ,FlatList ,ViewToken ,Dimensions ,NativeSyntheticEvent ,NativeScrollEvent } from 'react-native';

    export default function App() {

    const times = ['8:00','8:15','8:30','8:45','9:00','9:15','9:30','9:45','10:00','10:15','10:30','10:45','11:00','11:15','11:30','11:45','12:00','12:15','12:30','12:45','12:00','13:15','13:30',]
    const date = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]
    const grid= [0]
    for (let index = 1; index <= 600; index++) {
        grid.push(index)
    }

    const [index, setIndex] = React.useState(0)
    const handleViewableItemsChanged = (info: {
        viewableItems: ViewToken[];
        changed: ViewToken[];
    }) => {
    if (info.viewableItems.length > 0 && info.viewableItems[0].item) {
        setIndex(info.viewableItems[0].item.id);
        console.log("========",info.viewableItems[0].item.id)
    }
    };

    const viewabilityConfigCallbackPairs = React.useRef([
    {
        viewabilityConfig: {
        minimumViewTime: 0,
        viewAreaCoveragePercentThreshold: 0,
        waitForInteraction: true,
        },
        onViewableItemsChanged: handleViewableItemsChanged,
    },
    ]);

    const gridRef = React.useRef<FlatList>(null);
    const dateRef = React.useRef<FlatList>(null);
    const timeRef = React.useRef<FlatList>(null);


    const dateFlatList = (color? : string) => {
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
                    ref={dateRef}
                    data={grid}
                    style={styles.dateFlatList}
                    numColumns={7*4}
                    keyExtractor={(_, index) => `${index}`}
                    scrollEventThrottle={1}
                    onScrollToIndexFailed={() => console.log("error")}
                    onScroll={(e) => {
                        timeRef.current?.scrollToOffset({
                            offset:e.nativeEvent.contentOffset.y,
                            animated: false,
                        });
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
    const [views, setViews] = React.useState<{element: JSX.Element,id: number}[]>([{element: dateFlatList(),id: 0}])
    const onScrollEndDrag = (item:NativeSyntheticEvent<NativeScrollEvent>) => {
        console.log(Math.round(item.nativeEvent.contentOffset.x / DATE_WIDTH))
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
                    scrollEventThrottle={1}
                    onScrollToIndexFailed={() => console.log("error")}
                    onScroll={(e) => {
                        dateRef.current?.scrollToOffset({
                            offset:e.nativeEvent.contentOffset.y,
                            animated: false,
                        });
                    }}
                    renderItem={(item) => {
                        return (
                            <View style = {styles.timeTextContainer}><Text style={styles.timeText}>{item.item}</Text></View>
                        )
                    }}
                />

                {/* スケジュールのグリッド */}
                <FlatList
                    data={views}
                    ref = {gridRef}
                    snapToInterval={DATE_WIDTH}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    decelerationRate={0.6}
                    onScrollToIndexFailed={() => console.log("error")}
                    horizontal
                    onScrollEndDrag={(item) => onScrollEndDrag(item)}
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
    const TIME_WIDTH = Dimensions.get('screen').width * (375 - 295) / 375;
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
