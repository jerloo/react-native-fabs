import * as React from 'react'

import ActionButtonComponent from './ActionButton'
import ActionButtonItem from './ActionButtonItem'
import { ComponentProps } from './utils'

const ActionButton = (props: ComponentProps<typeof ActionButtonComponent>) => (
  <ActionButtonComponent {...props} />
)

export default {
  ActionButton,
  ActionButtonItem,
}
