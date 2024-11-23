# frozen_string_literal: true

class ListsChannel < ApplicationCable::Channel
  def subscribed
    stream_for 'lists'
  end
end
