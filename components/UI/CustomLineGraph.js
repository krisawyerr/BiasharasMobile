import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Svg, Line, Circle, Text as SvgText } from 'react-native-svg';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { formatDollarAmountShorthand } from '../../utils/format';

export default function CustomLineGraph({ graphData, selectedIndex, setSelectedIndex, numberColor, lineColor, selectorColor}) {
    const { width: screenWidth } = Dimensions.get('window');
    const height = 200;
    const padding = 20;
    const graphWidth = screenWidth - 2 * padding;

    const maxValue = Math.max(...graphData);
    const minValue = Math.min(...graphData);
    const scaleY = (height - 2 * padding) / (maxValue - minValue);

    const handleGestureEvent = (event) => {
        const { x } = event.nativeEvent;
        const relativeX = x - padding;
        const index = Math.round((relativeX / graphWidth) * (graphData.length - 1));
        if (index >= 0 && index < graphData.length) {
            setSelectedIndex(index);
        }
    };

    const handleGestureEnd = () => {
        setSelectedIndex(null);
    };

    return (
        <PanGestureHandler onGestureEvent={handleGestureEvent} onEnded={handleGestureEnd}>
            <View style={styles.graphContainer}>
                <Svg width="100%" height={height}>
                    {graphData.map((value, index) => {
                        if (index + 1 < graphData.length) {
                            const x1 = padding + (index * graphWidth) / (graphData.length - 1);
                            const y1 = height - padding - (value - minValue) * scaleY;
                            const x2 = padding + ((index + 1) * graphWidth) / (graphData.length - 1);
                            const y2 = height - padding - (graphData[index + 1] - minValue) * scaleY;

                            return <Line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={lineColor} strokeWidth="2" />;
                        }
                    })}
                    {selectedIndex !== null && (
                        <>
                            <Line
                                x1={padding + (selectedIndex * graphWidth) / (graphData.length - 1)}
                                y1={padding}
                                x2={padding + (selectedIndex * graphWidth) / (graphData.length - 1)}
                                y2={height - padding}
                                stroke={selectorColor}
                                strokeWidth="2"
                                strokeDasharray="5, 5"
                            />
                            <Circle
                                cx={padding + (selectedIndex * graphWidth) / (graphData.length - 1)}
                                cy={height - padding - (graphData[selectedIndex] - minValue) * scaleY}
                                r={5}
                                fill={selectorColor}
                            />
                        </>
                    )}
                    <SvgText x={padding + (graphData.indexOf(maxValue) * graphWidth) / (graphData.length - 1)}
                             y={height - padding - (maxValue - minValue) * scaleY - 3} fill={numberColor} fontSize="12" textAnchor="middle">
                        {formatDollarAmountShorthand(maxValue)}
                    </SvgText>
                    <SvgText x={padding + (graphData.indexOf(minValue) * graphWidth) / (graphData.length - 1)}
                             y={height - padding - (minValue - minValue) * scaleY + 13} fill={numberColor} fontSize="12" textAnchor="middle">
                        {formatDollarAmountShorthand(minValue)}
                    </SvgText>
                </Svg>
            </View>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    graphContainer: {
        width: '100%',
        height: 200,
    },
});
