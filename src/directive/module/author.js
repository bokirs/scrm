import store from '../../store/index'
import { setRoute, setAuthorFunc, getAuthority, uniq, getElementsByClassName, setAutorArr } from '@/libs/util.js'
import { get } from 'https';
export default {
    bind: (el, binding, vnode, oldVnode) => {
        if (getAuthority() <= 0) {
            return false
        } else {
            if (binding.value) {
                el.style.display = 'block'
            } else {
                el.style.display = 'none'
            }
        }
    },
    inserted: (el, bind) =>{
    },
    updated:() => {
    },
    componentUpdate:() => {
    },
    unbind: (el, binding) => {
    }
}