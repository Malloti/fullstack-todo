class TasksController < ApplicationController
  before_action :set_list, only: [:index, :create]
  before_action :set_task, only: [:update, :destroy]

  # GET /lists/:list_id/tasks
  def index
    tasks = Task.where(list_id: @list.id)
    tasks = tasks.where(done: true) if params.has_key?(:done) && params[:done] == "true"
    tasks = tasks.where(done: false) if params.has_key?(:done) && params[:done] == "false"

    render json: tasks
  end

  # POST /lists/:list_id/tasks
  def create
    task = Task.create(title: params[:title], done: params[:done], list_id: @list.id)
    unless task.save
      render json: task.errors.full_messages, status: :unprocessable_entity
      return
    end

    render json: task, status: :created
  end

  # PUT /lists/:list_id/tasks/:id
  def update
    unless @task.update(title: params[:title], done: params[:done])
      render json: @task.errors.full_messages, status: :unprocessable_entity
      return
    end

    render json: @task, status: :ok
  end

  # DELETE /lists/:list_id/tasks/:id
  def destroy
    unless @task.destroy
      render json: @task.errors.full_messages, status: :unprocessable_entity
    end

    render json: {}, status: :ok
  end

  private
  def set_list
     @list = List.find(params[:list_id])
  end

  def set_task
    @task = Task.find(params[:id])
  end
end
