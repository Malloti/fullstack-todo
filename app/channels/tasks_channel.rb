# frozen_string_literal: true

class TasksChannel < ApplicationCable::Channel
  def subscribed
    stream_for 'tasks'
  end
end
