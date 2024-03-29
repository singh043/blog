/* eslint-disable react/prop-types */
const Spinner = ({className}) => {
  return (
    <div className={`${className}`}>
        <img 
            src="/loader.svg"
        />
    </div>
  )
}

export default Spinner;