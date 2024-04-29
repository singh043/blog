/* eslint-disable react/prop-types */
const Spinner = ({className}) => {
  return (
    <div className={`${className}`}>
        <img 
            src="/loader.svg"
            className="h-12 w-12"
        />
    </div>
  )
}

export default Spinner;