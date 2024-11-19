import assert from 'assert'
import {defmulti, DEFAULT} from './index.js'

describe('fundamental api', function () {
  const sound = defmulti((a) => a.kind,
                         [DEFAULT, () => 'default'],
                         ['DOG', () => 'bark']);

  it('should use default value we specified', () => {
    assert.equal('default', sound({}))
  })

  it('should bark if a dog', () => {
    assert.equal('bark', sound({kind:'DOG'}))
  })


  it('should allow extension', () => {
    sound.addMethod('CAT', () => 'MEOW')
    assert.equal('MEOW', sound({kind:'CAT'}))
  })
})

describe('no default behaviour', ()=>{
  const action = defmulti(a => a.kind);

  it('throws when no matching method and no default', ()=>{
    const errors = [];
    try {
      action({foo:'bar'})
    } catch (e) {
      errors.push(e)
    }

    assert(errors[0] instanceof Error)
    assert(errors[0].toString().includes('no DEFAULT'))

  })

})
