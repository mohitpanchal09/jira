import { useParams } from 'next/navigation'

function useParamsHook() {
  const params = useParams()
  return params
}

export default useParamsHook