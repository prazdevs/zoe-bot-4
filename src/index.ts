import 'reflect-metadata';

import { getRules } from './actions';

// addRuleUseCase.execute({
//   guild: '744620155501281421',
//   reddit: 'aww',
//   modChan: '744620396074238072',
//   publicChan: '744620519768326274'
// });
    
getRules().then(console.log);          
 