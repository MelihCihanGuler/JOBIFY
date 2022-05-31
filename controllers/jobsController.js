


const createJob = async(req, res) => {
    res.send('create job')
}

const getAllJobs = async(req, res) => {
    res.send('getAllJob job')
}

const updateJob = async(req, res) => {
    res.send('updateJob')
}

const deleteJob = async(req, res) => {
    res.send('deleteJob')
}

const showStats = async(req, res) => {
    res.send('showStats')
}

export { createJob, deleteJob, getAllJobs, updateJob, showStats }