import React from 'react'
import { shallow } from 'enzyme'
import { Button } from '@ui/index'

const mockFn = jest.fn()

describe('<Button />', () => {
  it('should be defined', () => {
    expect(Button).toBeDefined()
  })
  it('should render correctly', () => {
    const tree = shallow(<Button>Text</Button>)
    expect(tree).toMatchSnapshot()
  })
  it('should respond to click events', () => {
    const tree = shallow(<Button onClick={mockFn}>Text</Button>)
    tree.simulate('click')
    expect(mockFn).toHaveBeenCalled()
  })
})
