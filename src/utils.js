const makeNode = (name, note) => {
  let newNode = {};
  // id ? n.id = id : n.id = crypto.randomUUID();
  // name ? n.name = name : n.id = '';
  // if (note) n.note = note;
  // if (completed) n.completed = completed;
  // if (children) n.children = children;
  newNode.id = crypto.randomUUID();
  name ? newNode.name = name : newNode.name = '';
  if (note) newNode.note = note;
  // if (completed) n.completed = completed;
  // if (children) n.children = children;
  return newNode;
}

export default { makeNode };
