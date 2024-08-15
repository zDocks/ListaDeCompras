let originalListBackup = null;

export const filterCarne = (list, updateList) => {
    if (!originalListBackup) {
        backupOriginalList(list);
    }
    const filteredTodos = originalListBackup.todos.filter(todo => todo.filtro === "Carne");
    updateList({...list, todos: filteredTodos});
};

export const filterPeixe = (list, updateList) => {
    if (!originalListBackup) {
        backupOriginalList(list);
    }
    const filteredTodos = originalListBackup.todos.filter(todo => todo.filtro === "Peixe");
    updateList({...list, todos: filteredTodos});
};

export const showAll = (list, updateList) => {
    if (originalListBackup) {
        updateList({...list, todos: originalListBackup.todos});
    }
};

const backupOriginalList = (list) => {
    originalListBackup = {...list};
};
