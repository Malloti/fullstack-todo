class ListsController < ApplicationController
  before_action :set_list, only: [:update, :destroy]

  # GET /lists
  def index
    lists = List.all

    render json: lists
  end

  # POST /lists
  def create
    list = List.new(title: params[:title])
    unless list.save
      render json: list.errors, status: :unprocessable_entity
      return
    end

    ListsChannel.broadcast_to('lists', List.all)

    render json: list, status: :created
  end

  # PUT /lists/:id
  def update
    unless @list.update(title: params[:title])
      render json: @list.errors.full_messages, status: :unprocessable_entity
      return
    end

    ListsChannel.broadcast_to('lists', List.all)

    render json: @list, status: :ok
  end

  # DELETE /lists/:id
  def destroy
    unless @list.destroy
      render json: @list.errors.full_messages, status: :unprocessable_entity
    end

    ListsChannel.broadcast_to('lists', List.all)
    render json: {}, status: :ok
  end

  private
  def set_list
    @list = List.find(params[:id])
  end
end
