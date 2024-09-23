import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Line, Circle, Text as SvgText } from 'react-native-svg';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { formatDollarAmountShorthand } from '../../utils/format';

export default function CustomLineGraph({ graphData, selectedIndex, setSelectedIndex, numberColor, lineColor, selectorColor }) {
    const [graphDimensions, setGraphDimensions] = useState({ width: 0, height: 0 });
    const paddingVertical = 15;
    const horizontalPadding = 23;

    const maxValue = Math.max(...graphData);
    const minValue = Math.min(...graphData);
    const scaleY = maxValue === minValue ? 0 : (graphDimensions.height - 2 * paddingVertical) / (maxValue - minValue);

    const handleGestureEvent = (event) => {
        const { x } = event.nativeEvent;
        const relativeX = x - horizontalPadding;
        const index = Math.round((relativeX / (graphDimensions.width - 2 * horizontalPadding)) * (graphData.length - 1));
        if (index >= 0 && index < graphData.length) {
            setSelectedIndex(index);
        }
    };

    const handleGestureEnd = () => {
        setSelectedIndex(null);
    };

    return (
        <PanGestureHandler onGestureEvent={handleGestureEvent} onEnded={handleGestureEnd}>
            <View
                style={styles.graphContainer}
                onLayout={(event) => {
                    const { width, height } = event.nativeEvent.layout;
                    setGraphDimensions({ width, height });
                }}
            >
                <Svg width={graphDimensions.width} height={graphDimensions.height}>
                    {graphData.map((value, index) => {
                        const x1 = (index * (graphDimensions.width - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding;
                        const y1 = scaleY === 0 
                            ? graphDimensions.height / 2 
                            : graphDimensions.height - paddingVertical - (value - minValue) * scaleY;

                        const x2 = index === graphData.length - 1 
                            ? graphDimensions.width - horizontalPadding 
                            : ((index + 1) * (graphDimensions.width - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding;
                        const y2 = index === graphData.length - 1 ? y1 : 
                            scaleY === 0 
                                ? graphDimensions.height / 2 
                                : graphDimensions.height - paddingVertical - (graphData[index + 1] - minValue) * scaleY;

                        return <Line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={lineColor} strokeWidth="2" />;
                    })}

                    {selectedIndex !== null && (
                        <>
                            <Line
                                x1={(selectedIndex * (graphDimensions.width - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding}
                                y1={paddingVertical}
                                x2={(selectedIndex * (graphDimensions.width - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding}
                                y2={graphDimensions.height - paddingVertical}
                                stroke={selectorColor}
                                strokeWidth="2"
                                strokeDasharray="5, 5"
                            />
                            <Circle
                                cx={(selectedIndex * (graphDimensions.width - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding}
                                cy={scaleY === 0 
                                    ? graphDimensions.height / 2 
                                    : graphDimensions.height - paddingVertical - (graphData[selectedIndex] - minValue) * scaleY}
                                r={5}
                                fill={selectorColor}
                            />
                        </>
                    )}

                    <SvgText
                        x={(graphData.indexOf(maxValue) * (graphDimensions.width - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding}
                        y={scaleY === 0 
                            ? graphDimensions.height / 2 - 3 
                            : graphDimensions.height - paddingVertical - (maxValue - minValue) * scaleY - 3}
                        fill={numberColor}
                        fontSize="12"
                        textAnchor="middle"
                    >
                        {formatDollarAmountShorthand(maxValue)}
                    </SvgText>
                    <SvgText
                        x={(graphData.indexOf(minValue) * (graphDimensions.width - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding}
                        y={scaleY === 0 
                            ? graphDimensions.height / 2 + 13 
                            : graphDimensions.height - paddingVertical - (minValue - minValue) * scaleY + 13}
                        fill={numberColor}
                        fontSize="12"
                        textAnchor="middle"
                    >
                        {formatDollarAmountShorthand(minValue)}
                    </SvgText>
                </Svg>
            </View>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    graphContainer: {
        flex: 1,
        width: '100%',
    },
});
