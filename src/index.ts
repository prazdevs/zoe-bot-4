import 'reflect-metadata';

import { addRule, getRules, removeRule } from './actions';
import { getConnection } from './database';
import { Rule } from './entities/Rule';
import { getLatestSubmissions } from './fetchReddit';

async function doStuff() {
  const connection = await getConnection();
  const rules = await getRules(connection);
  console.log(rules);

  await removeRule(connection, '744620155501281421', 'zoemains');
  const rules2 = await getRules(connection);
  console.log(rules2);

  const rule = new Rule();
  rule.reddit = 'zoemains';
  rule.guild = '744620155501281421';
  (rule.modChan = '744620396074238072'),
    (rule.publicChan = '744620519768326274');

  await addRule(connection, rule);
  const rules3 = await getRules(connection);

  console.log(rules3);
}

doStuff();
