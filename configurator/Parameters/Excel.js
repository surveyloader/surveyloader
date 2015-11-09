import React, {
  DOM,
  createFactory as $
} from 'react'
import Radium from 'radium'
import _ from 'lodash'

require.ensure(['xlsx/dist/xlsx.core.min'], require => {
    require('xlsx/dist/xlsx.core.min')
})

import styles from './styles'

@Radium
export default class Excel extends React.Component {
  constructor (props) {
    super(props)
  }

  handleFile (e) {
    const { files } = e.target
    const reader = new FileReader()
    reader.onload = e => {
      const { result } = e.target
      const workbook = XLSX.read(result, { type: 'binary' })
      this.setState({
        workbook,
        sheet: workbook.SheetNames[0]
      }, this.handleColumnChange.bind(this))
      console.log(workbook)
    }
    reader.readAsBinaryString(files[0])
  }

  handleColumnChange (column) {
    const { workbook, sheet } = this.state
    const { setCol } = this.props

    if (!column) {
      column = Object.keys(workbook.Sheets[sheet])
        .filter(k => /^[A-Z]/.test(k))[0][0]
      console.log(workbook.Sheets[sheet], column)
    }

    this.setState({ col: column })

    setCol(Object.keys(workbook.Sheets[sheet])
      .filter(k => k[0] === column)
      .map(cell => workbook.Sheets[sheet][cell].w))
  }

  render () {
    const { workbook, sheet, col } = this.state

    const SelectSheet = props => DOM.p({
      children: [
        DOM.span({ children: ['Select sheet:'] }),
        DOM.select({
          defaultValue: sheet,
          onChange: e => {
            this.setState({
              sheet: e.target.value
            }, this.handleColumnChange.bind(this))
          },
          children: [
            workbook.SheetNames
              .map(s => DOM.option({
                key: s,
                value: s,
                children: [s] 
              }))
          ]
        })
      ]
    })

    const SelectColumn = props => DOM.p({
      children: [
        DOM.span({ children: ['Select column:'] }),
        DOM.select({
          defaultValue: col,
          onChange: e => {
            this.handleColumnChange.bind(this)(e.target.value)
          },
          children: [
            _.range(
              ...workbook.Sheets[sheet]['!ref']
                .match(/([A-Z])/g)
                .map((C, i) => C.charCodeAt(0) + i)
              )
              .map(c => DOM.option({
                key: c,
                value: String.fromCharCode(c),
                children: [String.fromCharCode(c)] 
              }))
          ]
        })
      ]
    })

    const ColumnValues = props => DOM.ul({
      children: Object.keys(workbook.Sheets[sheet])
        .filter(k => k[0] === col)
        .map(cell => DOM.li({
          children: [workbook.Sheets[sheet][cell].w]
        }))
    })

    return DOM.div({
      children: [
        DOM.span({
          children: ['Extract values from Excel file']
        }),
        DOM.input({
          type: 'file',
          multiple: null,
          onChange: this.handleFile.bind(this)
        }),
        workbook && $(SelectSheet)({}),
        sheet && $(SelectColumn)({}),
        col && $(ColumnValues)({})
      ]
    })
  }
}