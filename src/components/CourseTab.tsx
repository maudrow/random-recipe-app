import * as React from 'react'

type CourseTabProps = { isSelected: boolean, onClick: () => {}, name: string }

const tabClassCommon = ''
const tabClassSelected = 'bg-lblue text-white px-4 py-1 rounded-t-2xl w-1/4 border-navy border-x-3 border-t-3'
const tabClassNotSelected = 'bg-lgreen px-4 py-1 rounded-t-2xl w-1/4 border-navy border-3'

export default function CourseTab ({isSelected, onClick, name}: CourseTabProps) {
  return (
      <button value={name}
          className={
              isSelected ?
              [tabClassCommon, tabClassSelected].join(' ') :
              [tabClassCommon, tabClassNotSelected].join(' ')

          }
          onClick={onClick}
      >
        {name}
      </button>
  )
}
