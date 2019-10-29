const express = require('express');
const router = express.Router();

//Variable
const PENDING = "pending"
const COMPLETED = "completed"

//@route    POST 5505/task/query
//@desc     Get query of task
//@access   Public
router.post('/query', async (req, res) => {
  //Body
  const input = req.body

  //Task value
  const task = input.task

  //Dependency obj
  const d_g = input.dependencyGraph

  //CurrectState obj
  const c_s = input.currentState

  //Task of dependencyGraph obj
  const taskArr = d_g.tasks

  //Task of CurrentState(status)
  const csArr = c_s.tasks

  let varIndex = task
  let open = ''

  //Check array of currentState and dependencyGraph
  if (taskArr.length == csArr.length) {
    open = findDependencyRecursive(taskArr, varIndex, csArr, task, res)

    if (typeof open === "string") {
      if (open === '') {
        res.json({ Message: 'invalid status provided : Status must be either "pending" or "compteted"' })
      } else {
        res.json({ Message: open })
      }

    } else {
      res.json({ open })
    }

  } else {
    res.json({ Message: 'invalid input provided' })
  }
})


//Finding dependency recursively
const findDependencyRecursive = (taskArr, varIndex, csArr, task, res) => {

  //Find obj according to variable value
  const dependObj = taskArr[varIndex]
  const dep = dependObj.dependency

  //If requested is completed
  if (csArr[varIndex].status == COMPLETED && task == varIndex) {
    return false
  }

  //Check length of dependency array inside dependencyGraph
  if (dep.length > 0) {
    let open = ''

    //Find element inside dependencyGraph obj's dependecy array
    for (let j = 0; j < dep.length; j++) {
      if (dep[j] < taskArr.length) {
        varIndex = dep[j]

        //Calling function with varIndex
        open = findDependencyRecursive(taskArr, varIndex, csArr, task, res)
        if (typeof open !== 'string' && open) {
          break
        }
      } else {
        open = `Invalid task ${dep[j]} assigned`
      }

    }
    return open

  } else {
    const status = csArr[varIndex].status
    if (status === PENDING) {
      let _newStatus = false

      //if both same then no dependency then it should true
      if (task == varIndex) {
        _newStatus = true
      } else {
        _newStatus = false
      }
      return _newStatus

    } else if (status === COMPLETED) {

      //If task done and has no dependency
      if (task == varIndex) {
        return false
      }

      //Check length of dependencyGraph task
      if (taskArr.length > 0) {
        for (let k = 0; k < taskArr.length; k++) {
          let del_dependObj = taskArr[k]
          let del_dep = del_dependObj.dependency

          //Loop inside array and splice element from arr
          for (_d of del_dep) {
            if (_d === varIndex) {
              let ind = del_dep.indexOf(_d)
              del_dep.splice(ind, 1)
            }
          }
        }
      }

      //Call function and return with true/false value
      return findDependencyRecursive(taskArr, task, csArr, task, res)
    }
  }
}

module.exports = router