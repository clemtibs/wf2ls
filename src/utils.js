const makeNode = (name, note) => {
  // let this. = {};
  // id ? n.id = id : n.id = crypto.randomUUID();
  // name ? n.name = name : n.id = '';
  // if (note) n.note = note;
  // if (completed) n.completed = completed;
  // if (children) n.children = children;
  this.id = crypto.randomUUID();
  name ? this.name = name : this.name = '';
  if (note) this.note = note;
  // if (completed) n.completed = completed;
  // if (children) n.children = children;
  return this;
}

export default { makeNode };
