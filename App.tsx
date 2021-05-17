    import { StatusBar } from 'expo-status-bar';
    import React from 'react';
    import { StyleSheet, Text, View ,FlatList ,ViewToken ,Dimensions ,NativeSyntheticEvent ,NativeScrollEvent} from 'react-native';

    export default function App() {

    const times = ['10:00','10:00','10:00','10:00','10:00','10:00','10:00','10:00']
    const date= [0]
    for (let index = 1; index <= 200; index++) {
        date.push(index)
    }

    const [index, setIndex] = React.useState(0)
    const handleViewableItemsChanged = (info: {
        viewableItems: ViewToken[];
        changed: ViewToken[];
    }) => {
    if (info.viewableItems.length > 0 && info.viewableItems[0].item) {
        setIndex(info.viewableItems[0].item.id);
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

    const horizontalFlatlistRef = React.useRef<FlatList>(null);
    const timeRef = React.useRef<FlatList>(null);

    const dateFlatList = (color? : string) => {
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
                    data={date}
                    style={styles.dateFlatList}
                    numColumns={7}
                    keyExtractor={(_,index) => `${index}`}
                    // ListHeaderComponent={() => {
                    //     return (
                    //         <View>
                    //             <View style={styles.weekContainer}>
                    //                 <View style={styles.weekTextContainer}><Text style={styles.weekText}>日</Text></View>
                    //                 <View style={styles.weekTextContainer}><Text style={styles.weekText}>月</Text></View>
                    //                 <View style={styles.weekTextContainer}><Text style={styles.weekText}>火</Text></View>
                    //                 <View style={styles.weekTextContainer}><Text style={styles.weekText}>水</Text></View>
                    //                 <View style={styles.weekTextContainer}><Text style={styles.weekText}>木</Text></View>
                    //                 <View style={styles.weekTextContainer}><Text style={styles.weekText}>金</Text></View>
                    //                 <View style={styles.weekTextContainer}><Text style={styles.weekText}>土</Text></View>
                    //             </View>
                    //             <View style={styles.dateContainer}>
                    //                 <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>1</Text></View>
                    //                 <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>2</Text></View>
                    //                 <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>3</Text></View>
                    //                 <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>4</Text></View>
                    //                 <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>5</Text></View>
                    //                 <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>6</Text></View>
                    //                 <View style = {styles.dateTextContainer}><Text style = {styles.dateText}>7</Text></View>
                    //             </View>
                    //         </View>
                    //     )
                    // }}
                    // stickyHeaderIndices={[0]}
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
    const [views, setViews] = React.useState<{element: JSX.Element,id: number}[]>([{element: dateFlatList(),id: 0},{element: dateFlatList(),id: 1},{element: dateFlatList(),id: 2},{element: dateFlatList('green'),id: 3},{element: dateFlatList('white'),id: 4},{element: dateFlatList(),id: 5},{element: dateFlatList(),id: 6},{element: dateFlatList(),id: 7},{element: dateFlatList(),id: 8}])
    const onScrollEndDrag = (item:NativeSyntheticEvent<NativeScrollEvent>) => {
        // もし末端にたどり着いたら末端に＋４
        if (index == views[views.length - 2].id) {
            console.log("=====ここが末端です")
            const newViews: {element: JSX.Element,id: number}[] = [...views];
            newViews.push({ element: dateFlatList(), id: views[views.length - 1].id + 1 }, { element: dateFlatList(), id: views[views.length - 1].id + 2 }, { element: dateFlatList(), id: views[views.length - 1].id + 3 }, { element: dateFlatList(), id: views[views.length - 1].id + 4 })
            newViews.shift()
            newViews.shift()
            newViews.shift()
            newViews.shift()
            horizontalFlatlistRef.current?.scrollToIndex({ animated: false, index: 4 })
            setViews(newViews)

        } else if (index == views[0].id) {
            console.log("=====ここが先頭です")
            const newViews: {element: JSX.Element,id: number}[] = [...views];
            newViews.unshift({ element: dateFlatList(), id: views[0].id - 1 }, { element: dateFlatList(), id: views[1].id - 1 }, { element: dateFlatList(), id: views[2].id - 1 }, { element: dateFlatList(), id: views[3].id - 1 });
            newViews.pop();
            newViews.pop();
            newViews.pop();
            newViews.pop();
            horizontalFlatlistRef.current?.scrollToIndex({ animated: false, index: 4 })
            setViews(newViews)
        }
    }

    return (
        <View style={styles.container}>

            <View style={styles.gridContainer}>

                {/* 15分単位の時間 */}
                <FlatList
                    ref={timeRef}
                    data={times}
                    style = {styles.timeContainer}
                    keyExtractor={(_,index) => `${index}`}
                    renderItem={(item) => {
                        return (
                            <View style = {styles.timeTextContainer}><Text style={styles.timeText}>{item.item}</Text></View>
                        )
                    }}
                />

                {/* スケジュールのグリッド */}
                <FlatList
                    ref = {horizontalFlatlistRef}
                    snapToInterval={DATE_WIDTH}
                    viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    data={views}
                    decelerationRate={0.6}
                    horizontal
                    initialScrollIndex={4}
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
    const TIME_WIDTH = Dimensions.get('screen').width * (375 - 296) / 375;
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
