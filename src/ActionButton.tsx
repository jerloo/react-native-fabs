import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

import ActionButtonItem from './ActionButtonItem'
import {
  alignItemsMap,
  DEFAULT_ACTIVE_OPACITY,
  getTouchableComponent,
  isAndroid,
  touchableBackground,
} from './shared'

export interface ActionButtonProps extends ViewProps {
  children: React.ReactNode
  btnOutRange?: string
  resetToken?: any
  active?: boolean

  position?: string
  elevation?: number
  zIndex?: number

  hideShadow?: boolean
  shadowStyle?: {} | [any] | number
  bgColor?: string
  bgOpacity?: number
  buttonColor?: string
  buttonTextStyle?: TextStyle
  buttonText?: string
  offsetX?: number
  offsetY?: number
  spacing?: number
  size?: number
  autoInactive?: boolean
  onPress?: () => void
  renderIcon?: (active: boolean) => React.ReactElement<any>
  backdrop?: boolean | object
  degrees?: number
  verticalOrientation?: string | 'up' | 'down'
  backgroundTappable?: boolean
  activeOpacity?: number

  useNativeFeedback?: boolean
  fixNativeFeedbackRadius?: boolean
  nativeFeedbackRippleColor?: string

  onReset?: () => void
  btnOutRangeTxt?: string
  onLongPress?: () => void
}

const defaultProps = {
  resetToken: null,
  active: false,
  bgColor: 'transparent',
  bgOpacity: 1,
  buttonColor: 'rgba(0,0,0,1)',
  buttonTextStyle: {},
  buttonText: '+',
  spacing: 20,
  outRangeScale: 1,
  autoInactive: true,
  onPress: () => {},
  onPressIn: () => {},
  onPressOn: () => {},
  onPressOut: () => {},
  backdrop: false,
  degrees: 45,
  position: 'right',
  offsetX: 30,
  offsetY: 30,
  size: 56,
  verticalOrientation: 'up',
  backgroundTappable: false,
  useNativeFeedback: true,
  activeOpacity: DEFAULT_ACTIVE_OPACITY,
  fixNativeFeedbackRadius: false,
  nativeFeedbackRippleColor: 'rgba(255,255,255,0.75)',
  testID: undefined,
  accessibilityLabel: undefined,
  accessible: undefined,
}

const ActionButton = ({
  children,
  resetToken,
  active,
  onReset,
  position,
  offsetY,
  elevation,
  verticalOrientation,
  zIndex,
  outRangeScale,
  degrees,
  buttonColor,
  btnOutRange,
  size,
  fixNativeFeedbackRadius,
  useNativeFeedback,
  hideShadow,
  shadowStyle,
  offsetX,
  testID,
  accessible,
  nativeFeedbackRippleColor,
  activeOpacity,
  onLongPress,
  onPress,
  onPressIn,
  onPressOut,
  renderIcon,
  buttonTextStyle,
  btnOutRangeTxt,
  buttonText,
  autoInactive,
  bgColor,
  bgOpacity,
  backdrop,
  backgroundTappable,
  accessibilityLabel,
  style,
  spacing,
}: ActionButtonProps & typeof defaultProps) => {
  const [, setResetToken] = useState(resetToken)
  const [activeState, setActive] = useState(active)
  const anim = useRef(new Animated.Value(active ? 1 : 0))
  const timeout = useRef<null | ReturnType<typeof setTimeout>>(null)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
      timeout.current && clearTimeout(timeout.current)
    }
  }, [])

  useEffect(() => {
    if (active) {
      Animated.spring(anim.current, {
        useNativeDriver: false,
        toValue: 1,
      }).start()
      setActive(true)
      setResetToken(resetToken)
    } else {
      onReset && onReset()

      Animated.spring(anim.current, {
        useNativeDriver: false,
        toValue: 0,
      }).start()
      timeout.current = setTimeout(() => {
        setActive(false)
        setResetToken(resetToken)
      }, 250)
    }
  }, [resetToken, active, onReset])

  //////////////////////
  // STYLESHEET GETTERS
  //////////////////////

  const getOrientation = (): ViewStyle => {
    return { alignItems: alignItemsMap.get(position)!! }
  }

  const getOffsetXY = () => {
    return {
      // paddingHorizontal: offsetX,
      paddingVertical: offsetY,
    }
  }

  const getOverlayStyles = (): ViewStyle[] => {
    return [
      styles.overlay,
      {
        elevation: elevation,
        zIndex: zIndex,
        justifyContent:
          verticalOrientation === 'up' ? 'flex-end' : 'flex-start',
      },
    ]
  }

  const _renderMainButton = () => {
    const animatedViewStyle = {
      transform: [
        {
          scale: anim.current.interpolate({
            inputRange: [0, 1],
            outputRange: [1, outRangeScale],
          }),
        },
        {
          rotate: anim.current.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', degrees + 'deg'],
          }),
        },
      ],
    }

    const wrapperStyle = {
      backgroundColor: anim.current.interpolate({
        inputRange: [0, 1],
        outputRange: [buttonColor, btnOutRange || buttonColor],
      }),
      width: size,
      height: size,
      borderRadius: size / 2,
    }

    const buttonStyle: ViewStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      alignItems: 'center',
      justifyContent: 'center',
    }

    const Touchable = getTouchableComponent(useNativeFeedback)
    const parentStyle =
      isAndroid && fixNativeFeedbackRadius
        ? {
            right: offsetX,
            zIndex: zIndex,
            borderRadius: size / 2,
            width: size,
          }
        : { marginHorizontal: offsetX, zIndex: zIndex }

    return (
      <View
        style={[
          parentStyle,
          !hideShadow && shadowStyle,
          !hideShadow && shadowStyle,
        ]}
      >
        <Touchable
          testID={testID}
          accessible={accessible}
          accessibilityLabel={accessibilityLabel}
          background={touchableBackground(
            nativeFeedbackRippleColor,
            fixNativeFeedbackRadius
          )}
          activeOpacity={activeOpacity}
          onLongPress={onLongPress}
          onPress={() => {
            onPress()
            if (children) animateButton()
          }}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <Animated.View style={wrapperStyle}>
            <Animated.View style={[buttonStyle, animatedViewStyle]}>
              {_renderButtonIcon()}
            </Animated.View>
          </Animated.View>
        </Touchable>
      </View>
    )
  }

  const _renderButtonIcon = () => {
    if (renderIcon) return renderIcon(activeState)
    const textColor = (buttonTextStyle.color as string) || 'rgba(255,255,255,1)'

    return (
      <Animated.Text
        style={[
          styles.btnText,
          buttonTextStyle,
          {
            color: anim.current.interpolate({
              inputRange: [0, 1],
              outputRange: [textColor, btnOutRangeTxt || textColor],
            }),
          },
        ]}
      >
        {buttonText}
      </Animated.Text>
    )
  }

  const _renderActions = () => {
    if (!activeState) return null

    let actionButtons: ActionButtonItem[] = (!Array.isArray(children)
      ? [children]
      : children) as ActionButtonItem[]

    console.log('actionButtons', actionButtons)

    actionButtons = actionButtons.filter(
      (actionButton) => typeof actionButton === 'object'
    )

    console.log('actionButtons', actionButtons)

    const actionStyle: ViewStyle = {
      flex: 1,
      alignSelf: 'stretch',
      // backgroundColor: 'purple',
      justifyContent: verticalOrientation === 'up' ? 'flex-end' : 'flex-start',
      paddingTop: verticalOrientation === 'down' ? spacing : 0,
      zIndex: zIndex,
    }

    const props = {
      resetToken,
      active,
      onReset,
      position,
      offsetY,
      elevation,
      verticalOrientation,
      zIndex,
      outRangeScale,
      degrees,
      buttonColor,
      btnOutRange,
      size,
      fixNativeFeedbackRadius,
      useNativeFeedback,
      hideShadow,
      shadowStyle,
      offsetX,
      testID,
      accessible,
      nativeFeedbackRippleColor,
      activeOpacity,
      onLongPress,
      onPress,
      onPressIn,
      onPressOut,
      renderIcon,
      buttonTextStyle,
      btnOutRangeTxt,
      buttonText,
      autoInactive,
      bgColor,
      bgOpacity,
      backdrop,
      backgroundTappable,
      accessibilityLabel,
      style,
      spacing,
    }

    return (
      <View style={actionStyle} pointerEvents={'box-none'}>
        {actionButtons.map((item, idx) => (
          <ActionButtonItem
            key={idx}
            anim={anim.current}
            {...props}
            shadowStyle={item.props.shadowStyle}
            {...item.props}
            parentSize={size}
            btnColor={btnOutRange}
            onPress={() => {
              if (autoInactive) {
                timeout.current = setTimeout(() => {
                  reset()
                }, 200)
              }
              item.props.onPress && item.props.onPress()
            }}
          />
        ))}
      </View>
    )
  }

  const _renderTappableBackground = () => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={getOverlayStyles()}
        onPress={() => reset}
      />
    )
  }

  //////////////////////
  // Animation Methods
  //////////////////////

  const animateButton = (animate = true) => {
    if (activeState) return reset(animate)

    if (animate) {
      Animated.spring(anim.current, {
        useNativeDriver: false,
        toValue: 1,
      }).start()
    } else {
      anim.current.setValue(1)
    }

    setActive(true)
  }

  const reset = (animate = true) => {
    if (onReset) onReset()

    if (animate) {
      Animated.spring(anim.current, {
        useNativeDriver: false,
        toValue: 0,
      }).start()
    } else {
      anim.current.setValue(0)
    }

    timeout.current = setTimeout(() => {
      if (mounted.current) {
        setActive(false)
      }
    }, 250)
  }

  return (
    <View pointerEvents='box-none' style={[getOverlayStyles(), style]}>
      <Animated.View
        pointerEvents='none'
        style={[
          getOverlayStyles(),
          {
            backgroundColor: bgColor,
            opacity: anim.current.interpolate({
              inputRange: [0, 1],
              outputRange: [0, bgOpacity],
            }),
          },
        ]}
      >
        {backdrop}
      </Animated.View>
      <View
        pointerEvents='box-none'
        style={[getOverlayStyles(), getOrientation(), getOffsetXY()]}
      >
        {activeState && !backgroundTappable && _renderTappableBackground()}

        {verticalOrientation === 'up' && children && _renderActions()}
        {_renderMainButton()}
        {verticalOrientation === 'down' && children && _renderActions()}
      </View>
    </View>
  )
}

ActionButton.defaultProps = defaultProps

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
  btnText: {
    marginTop: -4,
    fontSize: 24,
    backgroundColor: 'transparent',
  },
})
export default ActionButton
