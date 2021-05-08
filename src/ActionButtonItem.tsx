import * as React from 'react'
import { Component } from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TextStyle,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'

import { ActionButtonProps } from './ActionButton'
import {
  alignItemsMap,
  DEFAULT_ACTIVE_OPACITY,
  getTouchableComponent,
  isAndroid,
  shadowStyle,
  touchableBackground,
} from './shared'

const { width: WIDTH } = Dimensions.get('window')
const SHADOW_SPACE = 10
const TEXT_HEIGHT = 22

const TextTouchable = isAndroid
  ? (props: any) => <TouchableNativeFeedback {...props} />
  : (props: any) => <TouchableWithoutFeedback {...props} />

export interface ActionButtonItemProps extends ActionButtonProps {
  size?: number
  title?: string
  onPress?: () => void
  buttonColor?: string
  textContainerStyle?: ViewStyle
  textStyle?: TextStyle
  spaceBetween?: number
  activeOpacity?: number
  hideLabelShadow?: boolean
  shadowStyle?: ViewStyle
  useNativeFeedback?: boolean
  fixNativeFeedbackRadius?: boolean
  nativeFeedbackRippleColor?: string
  parentSize?: number
  btnColor?: string
  anim?: Animated.Value
}

const defaultProps = {
  active: true,
  spaceBetween: 15,
  useNativeFeedback: true,
  activeOpacity: DEFAULT_ACTIVE_OPACITY,
  fixNativeFeedbackRadius: false,
  nativeFeedbackRippleColor: 'rgba(255,255,255,0.75)',
  numberOfLines: 1,
}

export default class ActionButtonItem extends Component<
  ActionButtonItemProps & typeof defaultProps
> {
  static get defaultProps() {
    return defaultProps
  }

  constructor(props: ActionButtonItemProps & typeof defaultProps) {
    super(props)
  }

  render() {
    const {
      size,
      position,
      verticalOrientation,
      hideShadow,
      spacing,
    } = this.props

    if (!this.props.active) return null

    const animatedViewStyle = {
      marginBottom: -SHADOW_SPACE,
      alignItems: alignItemsMap.get(position!!),

      // backgroundColor: this.props.buttonColor,
      opacity: this.props.anim,
      transform: [
        {
          translateY: this.props.anim!!.interpolate({
            inputRange: [0, 1],
            outputRange: [verticalOrientation === 'down' ? -40 : 40, 0],
          }),
        },
      ],
    }

    const buttonStyle: ViewStyle = {
      justifyContent: 'center',
      alignItems: 'center',
      width: size,
      height: size,
      borderRadius: size!! / 2,
      backgroundColor: this.props.buttonColor || this.props.btnColor,
    }

    if (position !== 'center' && position !== undefined)
      (buttonStyle as any)[position] = (this.props.parentSize!! - size!!) / 2

    const Touchable = getTouchableComponent(this.props.useNativeFeedback)

    const parentStyle =
      isAndroid && this.props.fixNativeFeedbackRadius
        ? {
            height: size,
            marginBottom: spacing,
            right: this.props.offsetX,
            borderRadius: this.props.size!! / 2,
          }
        : {
            paddingHorizontal: this.props.offsetX,
            height: size! + SHADOW_SPACE + spacing!,
          }
    return (
      <Animated.View
        pointerEvents='box-none'
        style={[animatedViewStyle, parentStyle]}
      >
        <View>
          <Touchable
            rejectResponderTermination
            testID={this.props.testID}
            accessibilityLabel={this.props.accessibilityLabel}
            background={touchableBackground(
              this.props.nativeFeedbackRippleColor,
              this.props.fixNativeFeedbackRadius
            )}
            activeOpacity={this.props.activeOpacity || DEFAULT_ACTIVE_OPACITY}
            onPress={this.props.onPress}
          >
            <View
              style={[
                buttonStyle,
                !hideShadow
                  ? { ...shadowStyle, ...this.props.shadowStyle }
                  : null,
              ]}
            >
              {this.props.children}
            </View>
          </Touchable>
        </View>
        {this._renderTitle()}
      </Animated.View>
    )
  }

  _renderTitle() {
    if (!this.props.title) return null

    const {
      textContainerStyle,
      hideLabelShadow,
      offsetX,
      parentSize,
      size,
      position,
      spaceBetween,
      numberOfLines,
    } = this.props
    const offsetTop = Math.max(size!! / 2 - TEXT_HEIGHT / 2, 0)
    const positionStyles: ViewStyle = { top: offsetTop }
    const hideShadow =
      hideLabelShadow === undefined ? this.props.hideShadow : hideLabelShadow

    if (position !== 'center' && position !== undefined) {
      ;(positionStyles as any)[position] =
        offsetX!! + (parentSize!! - size!!) / 2 + size!! + spaceBetween
    } else {
      positionStyles.right = WIDTH / 2 + size!! / 2 + spaceBetween
    }

    const textStyles = [
      styles.textContainer,
      positionStyles,
      !hideShadow && shadowStyle,
      textContainerStyle,
    ]

    const title = React.isValidElement(this.props.title) ? (
      this.props.title
    ) : (
      <Text
        allowFontScaling={false}
        style={[styles.text, this.props.textStyle]}
        numberOfLines={numberOfLines}
      >
        {this.props.title}
      </Text>
    )

    return (
      <TextTouchable
        rejectResponderTermination
        background={touchableBackground(
          this.props.nativeFeedbackRippleColor,
          this.props.fixNativeFeedbackRadius
        )}
        activeOpacity={this.props.activeOpacity || DEFAULT_ACTIVE_OPACITY}
        onPress={this.props.onPress}
      >
        <View style={textStyles}>{title}</View>
      </TextTouchable>
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    position: 'absolute',
    paddingVertical: isAndroid ? 2 : 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    backgroundColor: 'white',
    height: TEXT_HEIGHT,
  },
  text: {
    flex: 1,
    fontSize: 12,
    color: '#444',
  },
})
